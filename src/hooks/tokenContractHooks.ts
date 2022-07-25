import { useQuery } from "@apollo/client";
import { useCall, useContractFunction, useEthers } from "@usedapp/core";
import { HAT_VAULTS_CONSTANT } from "components/AirdropMachine/data";
import { HATVaultsNFTContract } from "constants/constants";
import { Bytes, Contract } from "ethers";
import { keccak256, solidityKeccak256 } from "ethers/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { CHAINID } from "settings";
import { AirdropMachineWallet, NFTEligibilityElement } from "types/types";
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

interface EligibilityData extends NFTEligibilityElement {
  isRedeemed: boolean;
  tokenId: number;
  tokenUri: string;
}

interface DepositEligibilityData {
  pid: string;
  tier: number;
  isEligibile: boolean;
  isRedeemed: boolean;
  masterAddress: string;
}

const DATA_REFRESH_TIME = 10000;

export function useTokenActions(address?: string) {
  const { library, account, chainId } = useEthers();
  const { masters } = useVaults();
  const [contract, setContract] = useState<Contract>();
  const { send: redeemMultipleFromTree, state: redeemMultipleFromTreeState } = useContractFunction(new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), "redeemMultipleFromTree", { transactionName: "Redeem NFTs" });
  const [eligibilityPerPid, setEligibilityPerPid] = useState<DepositEligibilityData[]>();
  const [lastMerkleTree, setLastMerkleTree] = useState<MerkleTreeChanged>();
  const [merkleTree, setMerkleTree] = useState<AirdropMachineWallet[]>();
  const isBeforeDeadline = lastMerkleTree?.deadline ? Date.now() < Number(lastMerkleTree.deadline) : undefined;
  const actualAddress = address ?? account;

  useEffect(() => {
    setContract(new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi, library));
  }, [library])

  const { data: stakerData } = useQuery<{ stakers: { pid: string }[] }>(
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
      const isEligibile = await contract.isEligible(masterAddress, pid, account);
      const tier = await contract.getTierFromShares(masterAddress, pid, account);
      const tiers: DepositEligibilityData[] = [];
      for (let i = 1; i++; i <= tier) {
        const isRedeemed = await contract.tokensRedeemed(pid, tier, actualAddress) as boolean;
        tiers.push({ pid, tier, isEligibile, isRedeemed, masterAddress });
      }
      return tiers;
    }));
    const eligibilityPerPid = eligibilitiesPerPid.flat();
    setEligibilityPerPid(eligibilityPerPid);
  }, [contract, account, actualAddress, masters, pids])

  useEffect(() => {
    getEligibilityForPids();
  }, [getEligibilityForPids])


  /** ALL per user */
  const addressEligibility = merkleTree?.find(wallet => wallet.address.toLowerCase() === actualAddress?.toLowerCase());

  /** ALL per user with isRedeemed indicator */
  const [extendedEligibility, setExtendedEligibility] = useState<EligibilityData[]>();

  /** Only redeemable */
  const redeemable = extendedEligibility?.filter(nft => !nft.isRedeemed);

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
    getMerkleTree();
  }, [getMerkleTree])

  const getTreeEligibility = useCallback(async (addressEligibility: AirdropMachineWallet) => {
    if (!contract) return;
    return Promise.all(addressEligibility.nft_elegebility.map(async (nft): Promise<EligibilityData> => {
      const isRedeemed = await contract.tokensRedeemed(nft.pid, nft.tier, actualAddress) as boolean;
      const tokenId = await contract.tokenIds(actualAddress, nft.pid, nft.tier);
      const tokenUri = await contract.uri(tokenId); 
      return { ...nft, isRedeemed, tokenId, tokenUri };
    }))
  }, [contract, actualAddress])

  // useEffect(() => {
  //   (async () => {
  //     if (addressEligibility) {
  //       const extendedData = await buildExtendedEligibility(addressEligibility);
  //       setExtendedEligibility(extendedData);
  //     }
  //   })()
  // }, [buildExtendedEligibility, addressEligibility])

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
      return builtMerkleTree.getHexProof(hashToken(nft.contract_address, nft.pid, actualAddress!, nft.tier));
    })
    return proofs;
  }, [redeemable, merkleTree, actualAddress]);


  const redeem = useCallback(async () => {
    const redeemableProofs = buildProofsForRedeemables();
    if (!redeemable) return;
    const hatVaults = redeemable.map(nft => nft.contract_address);
    const pids = redeemable.map(nft => nft.pid);
    const tiers = redeemable.map(nft => nft.tier);
    await redeemMultipleFromTree(hatVaults, pids, actualAddress, tiers, redeemableProofs);
  }, [redeemable, actualAddress, buildProofsForRedeemables, redeemMultipleFromTree])


  return {
    lastMerkleTree,
    merkleTree,
    isBeforeDeadline,
    extendedEligibility,
    addressEligibility,
    redeem,
    eligibilityPerPid,
  }
}


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
