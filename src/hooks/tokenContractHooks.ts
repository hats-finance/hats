import { useQuery } from "@apollo/client";
import { TransactionStatus, useCall, useContractFunction, useEthers } from "@usedapp/core";
import { HAT_VAULTS_CONSTANT } from "components/AirdropMachine/data";
import { HATVaultsNFTContract } from "constants/constants";
import { Bytes, Contract } from "ethers";
import { keccak256, solidityKeccak256 } from "ethers/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { CHAINID } from "settings";
import { AirdropMachineWallet, NFTTokenInfo } from "types/types";
import { ipfsTransformUri } from "utils";
import hatVaultNftAbi from "data/abis/HATVaultsNFT.json";
import { getStaker } from "graphql/subgraph";
import { useVaults } from "./useVaults";

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
  redeem: () => Promise<any>;
  redeemMultipleFromTree: (...args: any[]) => Promise<any>;
  redeemMultipleFromTreeState: TransactionStatus;
  actualAddressInfo?: AirdropMachineWallet;
  actualAddress?: string;
}

const DATA_REFRESH_TIME = 10000;

export function useNFTTokenData(address?: string): INFTTokenData {
  const { library, account, chainId } = useEthers();
  const { masters } = useVaults();
  const [contract, setContract] = useState<Contract>();
  const { send: redeemMultipleFromTree, state: redeemMultipleFromTreeState } =
    useContractFunction(new Contract(HATVaultsNFTContract[CHAINID
    ], hatVaultNftAbi), "redeemMultipleFromTree", { transactionName: "Redeem NFTs" });
  const [nftTokens, setNftTokens] = useState<NFTTokenInfo[]>([]);
  const actualAddress = address ?? account;
  const [lastMerkleTree, setLastMerkleTree] = useState<MerkleTreeChanged>();
  const [merkleTree, setMerkleTree] = useState<AirdropMachineWallet[]>();
  const isBeforeDeadline = lastMerkleTree?.deadline ? Date.now() < Number(lastMerkleTree.deadline) : undefined;
  const actualAddressInfo = merkleTree?.find(wallet => wallet.address.toLowerCase() === actualAddress?.toLowerCase());

  /** Only redeemable */
  const redeemable = nftTokens?.filter(nft => !nft.isRedeemed);

  useEffect(() => {
    setNftTokens([]);
  }, [actualAddress]);

  useEffect(() => {
    if (chainId)
      setContract(new Contract(HATVaultsNFTContract[chainId], hatVaultNftAbi, library));
  }, [library, chainId])

  const { data: stakerData } = useQuery<{ stakers: { pid: number }[] }>(
    getStaker(account!), {
    variables: { chainId },
    context: { chainId },
    pollInterval: DATA_REFRESH_TIME
  })

  const pids = stakerData?.stakers.map(staker => staker?.pid);

  const getEligibilityForPids = useCallback(async () => {
    const masterAddress = masters?.[0].address;
    if (!pids || !contract || !masterAddress) return;
    const eligibilitiesPerPid = await Promise.all(pids?.map(async (pid) => {
      const isEligibile = await contract.isEligible(masterAddress, pid, actualAddress);
      const tier = await contract.getTierFromShares(masterAddress, pid, actualAddress);
      const tokens: NFTTokenInfo[] = [];
      for (let i = 1; i++; i <= tier) {
        const isRedeemed = await contract.tokensRedeemed(pid, tier, actualAddress) as boolean;
        const tokenId = await contract.tokenIds(actualAddress, pid, tier);
        const tokenUri = await contract.uri(tokenId);
        tokens.push({ pid, tier, isEligibile, isRedeemed, masterAddress, tokenId, tokenUri, type: "Deposit" });
      }
      return tokens;
    }));
    const eligibilityPerPid = eligibilitiesPerPid.flat();
    setNftTokens(prev => [...prev, ...eligibilityPerPid]);
  }, [contract, actualAddress, masters, pids])

  useEffect(() => {
    if (pids && pids.length > 0)
      getEligibilityForPids();
  }, [getEligibilityForPids, pids])

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


  const redeem = useCallback(async () => {
    const redeemableProofs = buildProofsForRedeemables();
    if (!redeemable) return;
    const hatVaults = redeemable.map(nft => nft.masterAddress);
    const pids = redeemable.map(nft => nft.pid);
    const tiers = redeemable.map(nft => nft.tier);
    await redeemMultipleFromTree(hatVaults, pids, actualAddress, tiers, redeemableProofs);
  }, [redeemable, actualAddress, buildProofsForRedeemables, redeemMultipleFromTree])
  return {
    lastMerkleTree,
    merkleTree,
    isBeforeDeadline,
    redeemable,
    redeem,
    redeemMultipleFromTree,
    redeemMultipleFromTreeState,
    actualAddressInfo,
    actualAddress
  };
};


const buildMerkleTree = (data: AirdropMachineWallet[]) => {
  const hashes: Buffer[] = [];
  data.forEach(wallet => {
    wallet.nft_elegebility.forEach(nft => {
      hashes.push(hashToken(nft.contract_address, nft.pid, wallet.address, nft.tier));
    })
  })

  return new MerkleTree(hashes, keccak256, { sortPairs: true });
}

const hashToken = (hatVaults: string, pid: number, account: string, tier: number) => {
  return Buffer.from(solidityKeccak256(['address', 'uint256', 'address', 'uint8'], [hatVaults, pid, account, tier]).slice(2), 'hex');
}

export function useRedeemMultipleFromShares() {
  return useContractFunction(new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), "redeemMultipleFromShares", { transactionName: "Redeem NFTs" });
}

export function useGetTierFromShares(pid: number, account: string): number | undefined {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "getTierFromShares", args: [HAT_VAULTS_CONSTANT, pid, account] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}
