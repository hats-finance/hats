import { useEthers } from "@usedapp/core";
import { useCallback, useEffect } from "react";
import { TEMP_WALLETS } from "./data";
import { solidityKeccak256 } from "ethers/lib/utils";
import { AirdropMachineWallet } from "types/types";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

export const checkEligibility = async (address: string) => (
  TEMP_WALLETS.wallets.find(wallet => wallet.id === address)
)

export const useFetchAirdropData = async (toggleAirdropPrompt: () => void) => {
  const { account } = useEthers();

  const getAirdropData = useCallback(async () => {
    if (account) {
      const eligibaleData = await checkEligibility(account);
      /** TODO: show only when:
       * 1. not redeemed - need to check
       * 2. not appears in the local storage
       */
      if (eligibaleData) {
        toggleAirdropPrompt();
      }
    }
  }, [account, toggleAirdropPrompt])

  useEffect(() => {
    getAirdropData();
  }, [account]);
}

export const getProofsAndUpdateTree = (data: AirdropMachineWallet) => {
  const merkleTree = buildMerkleTree(data);

  const proofs = data.nft_elegebility.map(nft => {
    return merkleTree.getHexProof(hashToken(nft.contract_address, nft.pid, data.id, nft.tier));
  })
  return proofs;
}

const buildMerkleTree = (data: AirdropMachineWallet) => {
  const hashes = data.nft_elegebility.map(nft => {
    return hashToken(nft.contract_address, nft.pid, data.id, nft.tier);
  })

  return new MerkleTree(hashes, keccak256, { sortPairs: true });
}

const hashToken = (hatVaults: string, pid: number, account: string, tier: number) => {
  return Buffer.from(solidityKeccak256(['address', 'uint256', 'address', 'uint8'], [hatVaults, pid, account, tier]).slice(2), 'hex');
}
