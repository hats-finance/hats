import { useQuery } from "@apollo/client";
import { TransactionStatus, useContractFunction, useEthers } from "@usedapp/core";
import { HATVaultsNFTContract, NFTContractDataProxy } from "constants/constants";
import { Bytes, Contract } from "ethers";
import { keccak256, solidityKeccak256 } from "ethers/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { AirdropMachineWallet, IStaker, NFTTokenInfo } from "types/types";
import { ipfsTransformUri } from "utils";
import hatVaultNftAbi from "data/abis/HATVaultsNFT.json";
import { GET_STAKER } from "graphql/subgraph";
import { TEMP_WALLETS } from "components/AirdropMachine/data";

const { MerkleTree } = require('merkletreejs');

interface MerkleTreeChanged {
  merkleTreeIPFSRef: string;
  deadline: number;
  root: Bytes;
}

export interface INFTTokenData {
  lastMerkleTree?: MerkleTreeChanged;
  merkleTree?: AirdropMachineWallet[];
  isBeforeDeadline?: boolean;
  redeemable?: NFTTokenInfo[];
  redeemTree: () => Promise<any>;
  redeemMultipleFromTreeState: TransactionStatus;
  redeemShares: () => Promise<any>;
  redeemMultipleFromSharesState: TransactionStatus;
  actualAddressInfo?: AirdropMachineWallet;
  actualAddress?: string;
  airdropToRedeem: boolean;
  depositToRedeem: boolean;
}

const DATA_REFRESH_TIME = 10000;

export function useNFTTokenData(address?: string): INFTTokenData {
  const { library, account, chainId } = useEthers();
  const [contract, setContract] = useState<Contract>();
  const { send: redeemMultipleFromTree, state: redeemMultipleFromTreeState } =
    useContractFunction(new Contract(chainId && HATVaultsNFTContract[chainId],
      hatVaultNftAbi), "redeemMultipleFromTree", { transactionName: "Redeem NFTs" });
  const { send: redeemMultipleFromShares, state: redeemMultipleFromSharesState } = useContractFunction(
    new Contract(chainId && HATVaultsNFTContract[chainId], hatVaultNftAbi), "redeemMultipleFromShares", { transactionName: "Redeem NFTs" });
  const [nftTokens, setNftTokens] = useState<NFTTokenInfo[]>([]);
  const actualAddress = address ?? account;
  const [lastMerkleTree, setLastMerkleTree] = useState<MerkleTreeChanged>();
  /** Temporary use of TEMP_WALLETS until the merkle tree will be updated to the new structure */
  const [merkleTree, setMerkleTree] = useState<AirdropMachineWallet[]>(TEMP_WALLETS.wallets);
  const isBeforeDeadline = lastMerkleTree?.deadline ? Date.now() < Number(lastMerkleTree.deadline) : undefined;
  const actualAddressInfo = merkleTree?.find(wallet => wallet.address.toLowerCase() === actualAddress?.toLowerCase());

  const redeemable = nftTokens?.filter(nft => !nft.isRedeemed);

  const airdropToRedeem = redeemable?.filter(nft => nft.type === "MerkleTree")?.some(nft => !nft.isRedeemed);
  const depositToRedeem = redeemable?.filter(nft => nft.type === "Deposit")?.some(nft => !nft.isRedeemed);

  useEffect(() => {
    setNftTokens([]);
  }, [actualAddress]);

  useEffect(() => {
    if (chainId)
      setContract(new Contract(HATVaultsNFTContract[chainId], hatVaultNftAbi, library));
  }, [library, chainId])

  const { data: stakerData } = useQuery<{ stakers: IStaker[] }>(
    GET_STAKER, {
    variables: { address: actualAddress },
    context: { chainId },
    pollInterval: DATA_REFRESH_TIME
  })

  const pidsWithAddress = stakerData?.stakers.map(staker => ({ pid: staker?.pid, masterAddress: staker?.master.address }));

  const getEligibilityForPids = useCallback(async () => {
    if (!pidsWithAddress || !contract) return;
    const eligibilitiesPerPid = await Promise.all(pidsWithAddress?.map(async (pidWithAddress) => {
      const { pid, masterAddress } = pidWithAddress
      const isEligibile = await contract.isEligible(NFTContractDataProxy[masterAddress.toLowerCase()], pid, actualAddress);
      const tier = await contract.getTierFromShares(NFTContractDataProxy[masterAddress.toLowerCase()], pid, actualAddress);
      const tokens: NFTTokenInfo[] = [];
      for (let i = 1; i++; i <= tier) {
        const isRedeemed = await contract.tokensRedeemed(pid, tier, actualAddress) as boolean;
        const tokenId = await contract.tokenIds(actualAddress, pid, tier);
        const tokenUri = await contract.uri(tokenId);
        tokens.push({ ...pidWithAddress, tier, isEligibile, isRedeemed, tokenId, tokenUri, type: "Deposit" });
      }
      return tokens;
    }));
    const eligibilityPerPid = eligibilitiesPerPid.flat();
    setNftTokens(prev => [...prev, ...eligibilityPerPid]);
  }, [contract, actualAddress, pidsWithAddress])

  useEffect(() => {
    if (pidsWithAddress && pidsWithAddress.length > 0)
      getEligibilityForPids();
  }, [getEligibilityForPids, pidsWithAddress])

  const getTreeEligibility = useCallback(async () => {
    if (!contract || !actualAddressInfo) return;
    const treeNfts = await Promise.all(actualAddressInfo.nft_elegebility.map(async (nft): Promise<NFTTokenInfo> => {
      const isRedeemed = await contract.tokensRedeemed(nft.pid, nft.tier, actualAddress) as boolean;
      const tokenId = await contract.tokenIds(actualAddress, nft.pid, nft.tier);
      const tokenUri = await contract.uri(tokenId);
      return { ...nft, isRedeemed, tokenId, tokenUri, isEligibile: true, type: "MerkleTree" };
    }));
    setNftTokens(prev => [...prev, ...treeNfts])
  }, [contract, actualAddress, actualAddressInfo])

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
      /** temporary disable fetching of the merkle tree (use mock data) */
      setMerkleTree(await response.json());
      setLastMerkleTree(args);
    }
  }, [contract])

  useEffect(() => {
    if (contract)
      getMerkleTree();
  }, [getMerkleTree, contract])

  useEffect(() => {
    getTreeEligibility();
  }, [getTreeEligibility]);

  const buildProofsForRedeemables = useCallback(() => {
    if (!merkleTree) {
      return;
    }
    /**
    * The tree is built from ALL the data (including the redeemed NFTs)
    */
    const builtMerkleTree = buildMerkleTree(merkleTree);

    /**
     * Build the proofs only for the non-redeemed NFTs.
     */
    const proofs = redeemable?.map(nft => {
      return builtMerkleTree.getHexProof(hashToken(nft.masterAddress, nft.pid, actualAddress!, nft.tier));
    })
    return proofs;
  }, [redeemable, merkleTree, actualAddress]);

  const redeemTree = useCallback(async () => {
    const redeemableProofs = buildProofsForRedeemables();
    if (!redeemable) return;
    const hatVaults = redeemable.map(nft => nft.masterAddress);
    const pids = redeemable.map(nft => nft.pid);
    const tiers = redeemable.map(nft => nft.tier);
    await redeemMultipleFromTree(hatVaults, pids, actualAddress, tiers, redeemableProofs);
  }, [redeemable, actualAddress, buildProofsForRedeemables, redeemMultipleFromTree]);

  const redeemShares = useCallback(async () => {
    const depositRedeemables = redeemable.filter(nft => nft.type === "Deposit" && nft.isEligibile);
    const hatVaults = depositRedeemables.map(nft => nft.masterAddress);
    const pids = depositRedeemables.map(nft => nft.pid);
    await redeemMultipleFromShares(hatVaults, pids, actualAddress);
  }, [redeemMultipleFromShares, actualAddress, redeemable])

  return {
    lastMerkleTree,
    merkleTree,
    isBeforeDeadline,
    redeemable,
    redeemTree,
    redeemMultipleFromTreeState,
    redeemShares,
    redeemMultipleFromSharesState,
    actualAddressInfo,
    actualAddress,
    airdropToRedeem,
    depositToRedeem
  };
};


const buildMerkleTree = (data: AirdropMachineWallet[]) => {
  const hashes: Buffer[] = [];
  data.forEach(wallet => {
    wallet.nft_elegebility.forEach(nft => {
      hashes.push(hashToken(nft.masterAddress, nft.pid, wallet.address, nft.tier));
    })
  })

  return new MerkleTree(hashes, keccak256, { sortPairs: true });
}

const hashToken = (hatVaults: string, pid: number, account: string, tier: number) => {
  return Buffer.from(solidityKeccak256(['address', 'uint256', 'address', 'uint8'], [hatVaults, pid, account, tier]).slice(2), 'hex');
}