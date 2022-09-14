import { useQuery } from "@apollo/client";
import { TransactionStatus, useContractFunction, useEthers, useTransactions } from "@usedapp/core";
import { HATVaultsNFTContract, MAX_NFT_TIER, NFTContractDataProxy, Transactions } from "constants/constants";
import { Bytes, Contract } from "ethers";
import { solidityKeccak256 } from "ethers/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AirdropMachineWallet, IStaker, INFTTokenInfo, INFTTokenMetadata } from "types/types";
import { ipfsTransformUri } from "utils";
import hatVaultNftAbi from "data/abis/HATVaultsNFT.json";
import { GET_STAKER } from "graphql/subgraph";
import moment from "moment";
import { usePrevious } from "./usePrevious";
import { useSupportedNetwork } from "./useSupportedNetwork";
import { TransactionReceipt } from "@ethersproject/providers";

const { MerkleTree } = require('merkletreejs');
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
  checkDepositEligibility: (hint: IVaultWithAddress) => void;
  refreshProof: (nfts: INFTTokenInfo[]) => Promise<INFTTokenInfo[] | undefined>;
  treeTokens?: INFTTokenInfo[];
  proofTokens?: INFTTokenInfo[];
  treeRedeemables?: INFTTokenInfo[];
  proofRedeemables?: INFTTokenInfo[];
  treeRedeemablesCount: number;
  getTreeEligibility: () => Promise<INFTTokenInfo[] | undefined>;
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
  const nftTokens = useMemo(() => [...(treeTokens || [] as INFTTokenInfo[]), ...(proofTokens || [])].reduce((prev, curr) => {
    const exists = prev.find(nft => nft.tokenId.eq(curr.tokenId));
    if (exists) {
      if (curr.isDeposit)
        exists.isDeposit = true;
      if (curr.isMerkleTree)
        exists.isMerkleTree = true;
    } else
      prev.push(curr);
    return prev;
  }, [] as INFTTokenInfo[]), [treeTokens, proofTokens]);

  const prevAddress = usePrevious(address);
  const prevChainId = usePrevious(chainId);
  const [lastMerkleTree, setLastMerkleTree] = useState<MerkleTreeChanged>();
  const [merkleTree, setMerkleTree] = useState<AirdropMachineWallet[]>();
  const isBeforeDeadline = lastMerkleTree?.deadline ? moment().unix() < Number(lastMerkleTree.deadline) : undefined;
  const addressInfo = merkleTree?.find(wallet => wallet.address.toLowerCase() === address?.toLowerCase());
  const treeRedeemables = nftTokens?.filter(nft => nft.isMerkleTree && !nft.isRedeemed
    && !nftTokens.find(innerNft => innerNft.isRedeemed && innerNft.tokenId.eq(nft.tokenId)));
  const proofRedeemables = nftTokens?.filter(nft => nft.isDeposit && !nft.isRedeemed
    && !treeRedeemables.find(innerNft => innerNft.tokenId.eq(nft.tokenId)));
  const treeRedeemablesCount = treeRedeemables?.length ?? 0;

  useEffect(() => {
    if (address !== prevAddress || chainId !== prevChainId) {
      setTreeTokens(undefined);
      setProofTokens(undefined);
    }
  }, [address, prevAddress, chainId, prevChainId]);

  useEffect(() => {
    if (chainId && isSupportedNetwork)
      setActualContract(new Contract(HATVaultsNFTContract[chainId], hatVaultNftAbi, library));
  }, [library, chainId, isSupportedNetwork])

  const { data: stakerData } = useQuery<{ stakers: IStaker[] }>(
    GET_STAKER, {
    variables: { address },
    context: { chainId },
    pollInterval: DATA_REFRESH_TIME,
  })

  const refreshProof = async (nfts: INFTTokenInfo[]) => {
    const pidsWithAddresses = nfts.reduce((result, nft) => {
      if (!result.find(pidWithAddress => Number(pidWithAddress.pid) === Number(nft.pid)
        && pidWithAddress.masterAddress === nft.masterAddress)) {
        result.push({ pid: String(nft.pid), masterAddress: nft.masterAddress })
      }
      return result;
    }, [] as IVaultWithAddress[]);
    return getEligibilityForPids(pidsWithAddresses);
  };


  const getEligibilityForPids = useCallback(async (pidsWithAddress: IVaultWithAddress[]) => {
    if (!contract) return;
    const eligibilitiesPerPid = await Promise.all(pidsWithAddress.map(async pidWithAddress => {
      const { pid, masterAddress } = pidWithAddress;
      const proxyAddress = NFTContractDataProxy[masterAddress.toLowerCase()];
      const tiers = await contract.getTierFromShares(proxyAddress, pid, address);

      const tokens: INFTTokenInfo[] = [];
      for (let tier = 1; tier <= MAX_NFT_TIER; tier++) {
        const tokenId = await contract.getTokenId(proxyAddress, pid, tier);
        const isRedeemed = await contract.tokensRedeemed(tokenId, address) as boolean;
        if (tier > tiers) break;
        const tokenUri = await contract.uri(tokenId);
        if (!tokenUri) continue;
        const res = await fetch(ipfsTransformUri(tokenUri));
        const metadata = await res.json() as INFTTokenMetadata;
        tokens.push({ pid: Number(pidWithAddress.pid), masterAddress: pidWithAddress.masterAddress, tier, isRedeemed, tokenId, metadata, isDeposit: true, isMerkleTree: false });
      }
      return tokens;
    }))

    const eligibilityPerPid = eligibilitiesPerPid.flat();
    setProofTokens(eligibilityPerPid);
    return eligibilityPerPid
  }, [contract, address])

  const pidsWithAddress = stakerData?.stakers.map(staker => ({ pid: staker?.pid, masterAddress: staker?.master.address })) as IVaultWithAddress[] | undefined;
  const prevPidsWithAddress = usePrevious(pidsWithAddress);
  const checkDepositEligibility = useCallback(async (hint: IVaultWithAddress) => {
    if (!contract || !pidsWithAddress) return;
    const found = hint ? pidsWithAddress?.find(pidWithAddress => pidWithAddress.pid === hint.pid && pidWithAddress.masterAddress === hint.masterAddress) : false;
    const eligibilityPerPid = await getEligibilityForPids(found ? pidsWithAddress : [hint, ...pidsWithAddress]);
    return eligibilityPerPid && proofTokens && eligibilityPerPid.length > proofTokens.length;
  }, [getEligibilityForPids, pidsWithAddress, contract, proofTokens])

  useEffect(() => {
    if (pidsWithAddress && pidsWithAddress !== prevPidsWithAddress && !proofTokens) {
      getEligibilityForPids(pidsWithAddress);
    }
  }, [pidsWithAddress, prevPidsWithAddress, getEligibilityForPids, proofTokens])

  const getTreeEligibility = useCallback(async () => {
    if (!contract || !addressInfo) return;
    const treeNfts = await Promise.all(addressInfo.nft_elegebility.map(async (nft) => {
      const { pid, tier: tiers, masterAddress } = nft;
      const proxyAddress = NFTContractDataProxy[masterAddress.toLowerCase()];
      const tokens: INFTTokenInfo[] = [];
      for (let tier = 1; tier <= tiers; tier++) {
        const tokenId = await contract.getTokenId(proxyAddress, pid, tier);
        const isRedeemed = await contract.tokensRedeemed(tokenId, address) as boolean;
        const tokenUri = await contract.uri(tokenId);
        if (!tokenUri) return null;
        const metadata = await (await fetch(ipfsTransformUri(tokenUri))).json() as INFTTokenMetadata;
        tokens.push({ ...nft, tier, isRedeemed, tokenId, metadata, isMerkleTree: true, isDeposit: false });
      }
      return tokens;
    }));
    const treeTokens = (treeNfts.filter(nfts => nfts !== null) as INFTTokenInfo[][]).flat();
    setTreeTokens(treeTokens);
    return treeTokens;
  }, [contract, address, addressInfo])

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
      const ipfsContent = await response.json();
      const tree: AirdropMachineWallet[] = [];

      for (const wallet in ipfsContent) {
        tree.push({ address: wallet, ...ipfsContent[wallet] })
      }
      setMerkleTree(tree);
      setLastMerkleTree(args);
    }
  }, [contract])

  useEffect(() => {
    if (contract)
      getMerkleTree();
  }, [getMerkleTree, contract])

  useEffect(() => {
    if (addressInfo)
      getTreeEligibility();
  }, [addressInfo, getTreeEligibility]);

  const redeemTree = useCallback(async () => {
    if (!nftTokens || !merkleTree) return;
    const builtMerkleTree = buildMerkleTree(merkleTree);
    const redeemableProofs = treeRedeemables.map(nft => builtMerkleTree.getHexProof(
      hashToken(NFTContractDataProxy[nft.masterAddress.toLowerCase()], nft.pid, address!, nft.tier)));
    const hatVaults = treeRedeemables.map(nft => NFTContractDataProxy[nft.masterAddress.toLowerCase()]);
    const pids = treeRedeemables.map(nft => nft.pid);
    const tiers = treeRedeemables.map(nft => nft.tier);
    return redeemMultipleFromTree(hatVaults, pids, address, tiers, redeemableProofs);
  }, [nftTokens, address, redeemMultipleFromTree, treeRedeemables, merkleTree]);

  const redeemTreeTransaction = useTransactions().transactions.find(tx => !tx.receipt && tx.transactionName === Transactions.RedeemTreeNFTs);
  const prevRedeemTreeTransaction = usePrevious(redeemTreeTransaction);
  useEffect(() => {
    if (prevRedeemTreeTransaction && !redeemTreeTransaction) {
      getTreeEligibility();
    }
  }, [prevRedeemTreeTransaction, redeemTreeTransaction, getTreeEligibility])

  const redeemSharesTransaction = useTransactions().transactions.find(tx => !tx.receipt && tx.transactionName === Transactions.RedeemDepositNFTs);
  const prevRedeemSharesTransaction = usePrevious(redeemSharesTransaction);
  useEffect(() => {
    if (prevRedeemSharesTransaction && !redeemSharesTransaction && pidsWithAddress) {
      getEligibilityForPids(pidsWithAddress);
    }
  }, [prevRedeemSharesTransaction, redeemSharesTransaction, getEligibilityForPids, proofTokens, pidsWithAddress])

  const redeemProof = useCallback(async () => {
    if (!nftTokens) return;
    const hatVaults = proofRedeemables.map(nft => NFTContractDataProxy[nft.masterAddress.toLowerCase()]);
    const pids = proofRedeemables.map(nft => nft.pid);

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
    refreshProof,
    redeemMultipleFromSharesState,
    addressInfo,
    treeTokens,
    proofTokens,
    treeRedeemables,
    proofRedeemables,
    treeRedeemablesCount,
    checkDepositEligibility,
    getTreeEligibility
  };
};


const buildMerkleTree = (data: AirdropMachineWallet[]) => {
  const hashes: Buffer[] = [];
  data.forEach(wallet => {
    wallet.nft_elegebility.forEach(nft => {
      hashes.push(hashToken(NFTContractDataProxy[nft.masterAddress.toLowerCase()], nft.pid, wallet.address, nft.tier));
    })
  })

  return new MerkleTree(hashes, keccak256, { sortPairs: true });
}

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