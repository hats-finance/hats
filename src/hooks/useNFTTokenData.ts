import { useQuery } from "@apollo/client";
import { TransactionStatus, useContractFunction, useEthers } from "@usedapp/core";
import { MAX_NFT_TIER, NFTContractDataProxy, Transactions } from "constants/constants";
import { Bytes, Contract } from "ethers";
import { solidityKeccak256 } from "ethers/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AirdropMachineWallet, IStaker, INFTTokenInfo, INFTTokenMetadata, INFTTokenInfoRedeemed } from "types/types";
import { ipfsTransformUri } from "utils";
import hatVaultNftAbi from "data/abis/HATVaultsNFT.json";
import { GET_STAKER } from "graphql/subgraph";
import { usePrevious } from "./usePrevious";
import { useSupportedNetwork } from "./useSupportedNetwork";
import { TransactionReceipt } from "@ethersproject/providers";

import { MerkleTree } from 'merkletreejs';
import { CHAINS } from "settings";
const keccak256 = require("keccak256");

interface MerkleTreeChanged {
  merkleTreeIPFSRef: string;
  deadline: number;
  root: Bytes;
}

export interface INFTTokenData {
  lastMerkleTree?: MerkleTreeChanged;
  merkleTree?: AirdropMachineWallet[];
  isBeforeDeadline?: boolean;
  nftTokens?: INFTTokenInfo[];
  redeemTree: () => Promise<TransactionReceipt | undefined>;
  redeemMultipleFromTreeState: TransactionStatus;
  redeemProof: () => Promise<TransactionReceipt | undefined>;
  redeemMultipleFromSharesState: TransactionStatus;
  addressInfo?: AirdropMachineWallet;
  refreshProofAndRedeemed: (hint?: IVaultWithAddress) => Promise<INFTTokenInfoRedeemed[] | undefined>
  treeTokens?: INFTTokenInfo[];
  proofTokens?: INFTTokenInfo[];
  treeRedeemables?: INFTTokenInfoRedeemed[];
  proofRedeemables?: INFTTokenInfoRedeemed[];
  treeRedeemablesCount: number;
  withRedeemed?: INFTTokenInfoRedeemed[];
  refreshRedeemed: () => Promise<INFTTokenInfoRedeemed[] | undefined>;
}

interface IVaultWithAddress {
  pid: string;
  masterAddress: string;
}

const DATA_REFRESH_TIME = 10000;

export function useNFTTokenData(address?: string): INFTTokenData {
  const { library, chainId } = useEthers();
  const isSupportedNetwork = useSupportedNetwork();
  const [actualContract, setActualContract] = useState<Contract>();
  const contract = useDebounce(actualContract, 500);
  const { send: redeemMultipleFromTree, state: redeemMultipleFromTreeState } =
    useContractFunction(contract, "redeemMultipleFromTree", { transactionName: Transactions.RedeemTreeNFTs });
  const { send: redeemMultipleFromShares, state: redeemMultipleFromSharesState } = useContractFunction(
    contract, "redeemMultipleFromShares", { transactionName: Transactions.RedeemDepositNFTs });
  const [treeTokens, setTreeTokens] = useState<INFTTokenInfo[] | undefined>();
  const [proofTokens, setProofTokens] = useState<INFTTokenInfo[] | undefined>();


  const mergeTokens = (treeTokens: INFTTokenInfo[] | undefined, proofTokens: INFTTokenInfo[] | undefined) =>
    [...(treeTokens || [] as INFTTokenInfo[]), ...(proofTokens || [])].reduce((prev, curr) => {
      const exists = prev.find(nft => nft.tokenId.eq(curr.tokenId));
      if (exists) {
        if (curr.isDeposit)
          exists.isDeposit = true;
        if (curr.isMerkleTree)
          exists.isMerkleTree = true;
      } else
        prev.push(curr);
      return prev;
    }, [] as INFTTokenInfo[]);
  const nftTokens = useMemo(() => mergeTokens(treeTokens, proofTokens), [treeTokens, proofTokens]);
  const [withRedeemed, setWithRedeemed] = useState<INFTTokenInfoRedeemed[]>();
  const prevAddress = usePrevious(address);
  const prevChainId = usePrevious(chainId);
  const [lastMerkleTree, setLastMerkleTree] = useState<MerkleTreeChanged>();
  const [merkleTree, setMerkleTree] = useState<AirdropMachineWallet[]>();
  const isBeforeDeadline = lastMerkleTree?.deadline ? Date.now() < Number(lastMerkleTree.deadline) : undefined;

  const addressInfo = merkleTree?.find(wallet => wallet.address.toLowerCase() === address?.toLowerCase());
  const treeRedeemables = withRedeemed?.filter(nft => nft.isMerkleTree && !nft.isRedeemed);
  const proofRedeemables = withRedeemed?.filter(nft => nft.isDeposit && !nft.isMerkleTree && !nft.isRedeemed);
  const treeRedeemablesCount = treeRedeemables?.length ?? 0;

  useEffect(() => {
    if (address !== prevAddress || chainId !== prevChainId) {
      setTreeTokens(undefined);
      setProofTokens(undefined);
    }
  }, [address, prevAddress, chainId, prevChainId]);

  useEffect(() => {
    if (chainId && isSupportedNetwork && CHAINS[chainId]?.vaultsNFTContract)
      setActualContract(new Contract(CHAINS[chainId]?.vaultsNFTContract, hatVaultNftAbi, library));
  }, [library, chainId, isSupportedNetwork])

  const { data: stakerData } = useQuery<{ stakers: IStaker[] }>(
    GET_STAKER, {
    variables: { address },
    context: { chainId },
    pollInterval: DATA_REFRESH_TIME,
    fetchPolicy: "no-cache"
  })

  const getPidsWithAddressees = (nfts: INFTTokenInfo[]) =>
    nfts.reduce((result, nft) => {
      if (!result.find(pidWithAddress => Number(pidWithAddress.pid) === Number(nft.pid)
        && pidWithAddress.masterAddress === nft.masterAddress)) {
        result.push({ pid: String(nft.pid), masterAddress: nft.masterAddress })
      }
      return result;
    }, [] as IVaultWithAddress[]);

  const getEligibilityForPids = useCallback(async (pidsWithAddress: IVaultWithAddress[]) => {
    if (!contract) return;
    const eligibilitiesPerPid = await Promise.all(pidsWithAddress.map(async pidWithAddress => {
      const { pid, masterAddress } = pidWithAddress;
      const proxyAddress = NFTContractDataProxy[masterAddress.toLowerCase()];
      const tiers = await contract.getTierFromShares(proxyAddress, pid, address);

      const tokens: INFTTokenInfo[] = [];
      for (let tier = 1; tier <= MAX_NFT_TIER; tier++) {
        const tokenId = await contract.getTokenId(proxyAddress, pid, tier);
        if (tier > tiers) break;
        const tokenUri = await contract.uri(tokenId);
        if (!tokenUri) continue;
        const res = await fetch(ipfsTransformUri(tokenUri));
        const metadata = await res.json() as INFTTokenMetadata;
        tokens.push({ pid: Number(pidWithAddress.pid), masterAddress: pidWithAddress.masterAddress, tier, tokenId, metadata, isDeposit: true, isMerkleTree: false });
      }
      return tokens;
    }))

    const eligibilityPerPid = eligibilitiesPerPid.flat();
    setProofTokens(eligibilityPerPid);
    return eligibilityPerPid
  }, [contract, address])

  const pidsWithAddress = stakerData?.stakers.map(staker => ({ pid: staker?.pid, masterAddress: staker?.master.address })) as IVaultWithAddress[] | undefined;
  const prevPidsWithAddress = usePrevious(pidsWithAddress);

  useEffect(() => {
    if (pidsWithAddress && pidsWithAddress !== prevPidsWithAddress && !proofTokens) {
      getEligibilityForPids(pidsWithAddress);
    }
  }, [pidsWithAddress, prevPidsWithAddress, getEligibilityForPids, proofTokens]);

  const getTokensRedeemed = useCallback(async (nfts: INFTTokenInfo[]) => {
    if (!contract || !address) return;
    const withRedeemed = await Promise.all(nfts.map(async nft => {
      const isRedeemed = await contract.tokensRedeemed(nft.tokenId, address) as boolean;
      return { ...nft, isRedeemed };
    })) as INFTTokenInfoRedeemed[];
    return withRedeemed;
  }, [contract, address]);

  const refreshProofAndRedeemed = useCallback(async (hint?: IVaultWithAddress) => {
    if (!contract || !pidsWithAddress) return;
    const found = hint && pidsWithAddress?.find(pidWithAddress =>
      pidWithAddress.pid === hint.pid &&
      pidWithAddress.masterAddress === hint.masterAddress);
    const withPossibleHint = found || !hint ? pidsWithAddress : [hint, ...pidsWithAddress];
    const pidsEligibility = await getEligibilityForPids(withPossibleHint);
    const merged = mergeTokens(treeTokens, pidsEligibility);
    const withRedeemed = await getTokensRedeemed(merged);
    setWithRedeemed(withRedeemed);
    return withRedeemed;
  }, [getEligibilityForPids, getTokensRedeemed, treeTokens, pidsWithAddress, contract]);

  const refreshRedeemed = useCallback(async () => {
    if (!nftTokens) return;
    const withRedeemed = await getTokensRedeemed(nftTokens);
    setWithRedeemed(withRedeemed);
    return withRedeemed;
  }, [nftTokens, getTokensRedeemed]);

  const getTreeEligibility = useCallback(async () => {
    if (!contract || !addressInfo) return;
    const treeNfts = await Promise.all(addressInfo.nft_elegebility.map(async (nft) => {
      const { pid, tier: tiers, masterAddress } = nft;
      const proxyAddress = NFTContractDataProxy[masterAddress.toLowerCase()];
      const tokens: INFTTokenInfo[] = [];
      for (let tier = 1; tier <= tiers; tier++) {
        const tokenId = await contract.getTokenId(proxyAddress, pid, tier);
        const tokenUri = await contract.uri(tokenId);
        if (!tokenUri) return null;
        const metadata = await (await fetch(ipfsTransformUri(tokenUri))).json() as INFTTokenMetadata;
        tokens.push({ ...nft, pid: Number(nft.pid), tier, tokenId, metadata, isMerkleTree: true, isDeposit: false });
      }
      return tokens;
    }));
    const treeTokens = (treeNfts.filter(nfts => nfts !== null) as INFTTokenInfo[][]).flat();

    setTreeTokens(treeTokens);
    return treeTokens;
  }, [contract, addressInfo]);

  const getMerkleTree = useCallback(async () => {
    const data = contract?.filters.MerkleTreeChanged();
    if (!data) {
      return;
    }
    const filter = await contract?.queryFilter(data, 0);
    if (filter) {
      const lastElement = filter[filter.length - 1] as any | undefined;
      const args = lastElement.args as MerkleTreeChanged;
      const response = await fetch(ipfsTransformUri(args.merkleTreeIPFSRef));

      const ipfsContent = await response.json() as { [index: string]: AirdropMachineWallet };

      const tree = Object.entries(ipfsContent).map(([wallet, data]) =>
        ({ ...data, address: wallet })) as AirdropMachineWallet[];

      // for (const wallet in ipfsContent) {
      //   const nft_elegebility = ipfsContent[wallet].nft_elegebility as NFTEligibilityElement[];
      //   // handle duplicate pid with different tier or same tier but different type for pid
      //   const filtered = [] as NFTEligibilityElement[];
      //   nft_elegebility.forEach(nft => {
      //     const shouldAdd = nft_elegebility.find(innerNft => {
      //       const samePid = Number(innerNft.pid) === Number(nft.pid) && innerNft.masterAddress === nft.masterAddress;
      //       if (!samePid) return false;
      //       const sameTier = Number(innerNft.tier) === Number(nft.tier);
      //       if (sameTier && typeof innerNft.pid === 'string' && typeof nft.pid === 'number') return true;
      //       if (nft.tier > innerNft.tier) return true;
      //       return false;
      //     });
      //     if (shouldAdd)
      //       filtered.push(nft);
      //   });
      //   tree.push({ address: wallet, ...ipfsContent[wallet], nft_elegebility: filtered });
      //}
      setMerkleTree(tree);
      setLastMerkleTree(args);
    }
  }, [contract])

  useEffect(() => {
    if (contract)
      getMerkleTree();
  }, [getMerkleTree, contract])

  useEffect(() => {
    if (addressInfo && contract)
      getTreeEligibility();
  }, [addressInfo, contract, getTreeEligibility]);

  useEffect(() => {
    if (nftTokens) {
      refreshRedeemed()
    }
  }, [nftTokens, refreshRedeemed])

  const redeemTree = useCallback(async () => {
    if (!nftTokens || !merkleTree || !address || !addressInfo) return;
    const builtMerkleTree = new MerkleTree(merkleTree.map(wallet =>
      wallet.nft_elegebility.map(nft =>
        hashToken(NFTContractDataProxy[nft.masterAddress.toLowerCase()],
          Number(nft.pid), wallet.address, nft.tier))).flat(),
      keccak256, { sortPairs: true });
    const redeemableProofs = addressInfo.nft_elegebility.map(nft => builtMerkleTree.getHexProof(
      hashToken(NFTContractDataProxy[nft.masterAddress.toLowerCase()], Number(nft.pid), address, nft.tier)));
    const hatVaults = addressInfo.nft_elegebility.map(nft => NFTContractDataProxy[nft.masterAddress.toLowerCase()]);
    const pids = addressInfo.nft_elegebility.map(nft => nft.pid);
    const tiers = addressInfo.nft_elegebility.map(nft => nft.tier);
    return redeemMultipleFromTree(hatVaults, pids, address, tiers, redeemableProofs);
  }, [nftTokens, address, redeemMultipleFromTree, addressInfo, merkleTree]);

  // const redeemTreeTransaction = useTransactions().transactions.find(tx =>
  //   !tx.receipt && tx.transactionName === Transactions.RedeemTreeNFTs);
  // const prevRedeemTreeTransaction = usePrevious(redeemTreeTransaction);
  // useEffect(() => {
  //   if (prevRedeemTreeTransaction && !redeemTreeTransaction) {
  //     getTreeEligibility();
  //   }
  // }, [prevRedeemTreeTransaction, redeemTreeTransaction, addressInfo, getTreeEligibility])

  // const redeemSharesTransaction = useTransactions().transactions.find(tx => !tx.receipt && tx.transactionName === Transactions.RedeemDepositNFTs);
  // const prevRedeemSharesTransaction = usePrevious(redeemSharesTransaction);
  // useEffect(() => {
  //   if (prevRedeemSharesTransaction && !redeemSharesTransaction && pidsWithAddress) {
  //     getEligibilityForPids(pidsWithAddress);
  //   }
  // }, [prevRedeemSharesTransaction, redeemSharesTransaction, getEligibilityForPids, proofTokens, pidsWithAddress])

  const redeemProof = useCallback(async () => {
    if (!nftTokens || !proofRedeemables) return;
    const pidsWithAddresses = getPidsWithAddressees(proofRedeemables);
    const hatVaults = pidsWithAddresses.map(pidWA => NFTContractDataProxy[pidWA.masterAddress.toLowerCase()]);
    const pids = pidsWithAddresses.map(pidWA => pidWA.pid);

    return redeemMultipleFromShares(hatVaults, pids, address);
  }, [redeemMultipleFromShares, address, nftTokens, proofRedeemables])

  return {
    lastMerkleTree,
    merkleTree,
    isBeforeDeadline,
    nftTokens,
    redeemTree,
    redeemMultipleFromTreeState,
    redeemProof,
    redeemMultipleFromSharesState,
    addressInfo,
    treeTokens,
    proofTokens,
    treeRedeemables,
    proofRedeemables,
    treeRedeemablesCount,
    refreshProofAndRedeemed,
    refreshRedeemed,
    withRedeemed
  };
};



const hashToken = (hatVaults: string, pid: number, account: string, tier: number) => {
  return Buffer.from(solidityKeccak256(['address', 'uint256', 'address', 'uint8'], [hatVaults, pid, account, tier]).slice(2), 'hex');
}

function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}