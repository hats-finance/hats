import { useEthers } from "@usedapp/core";
import { useCallback, useEffect } from "react";
import { TEMP_WALLETS } from "./data";
import { solidityKeccak256 } from "ethers/lib/utils";
import { AirdropMachineWallet } from "types/types";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

export const getEligibilityData = async (address: string) => (
  TEMP_WALLETS.wallets.find(wallet => wallet.id === address)
)

export const useFetchAirdropData = async (toggleAirdropPrompt: () => void) => {
  const { account } = useEthers();

  const getAirdropData = useCallback(async () => {
    if (account) {
      const eligibaleData = await getEligibilityData(account);
      /** TODO: show only when:
       * 1. not redeemed - need to check
       * 2. check if deadline is in the future
       * 3. not appears in the local storage
       */
      if (eligibaleData) {
        toggleAirdropPrompt();
      }
    }
  }, [account, toggleAirdropPrompt])

  useEffect(() => {
    (async () => {
      await getAirdropData();
    })();
  }, [account]);
}

export const buildProofs = (data: AirdropMachineWallet) => {
  const merkleTree = buildMerkleTree(TEMP_WALLETS.wallets);

  /**
   * TODO: build proofs only from the NFTs that haven't been redeemed yet ; need to filter before useTokensRedeemed
   */
  const proofs = data.nft_elegebility.map(nft => {
    return merkleTree.getHexProof(hashToken(nft.contract_address, nft.pid, data.id, nft.tier));
  })
  return proofs;
}

const buildMerkleTree = (data: AirdropMachineWallet[]) => {
  const hashes: Buffer[] = [];
  data.forEach(wallet => {
    wallet.nft_elegebility.forEach(nft => {
      hashes.push(hashToken(nft.contract_address, nft.pid, wallet.id, nft.tier));
    })
  })

  return new MerkleTree(hashes, keccak256, { sortPairs: true });
}

const hashToken = (hatVaults: string, pid: number, account: string, tier: number) => {
  return Buffer.from(solidityKeccak256(['address', 'uint256', 'address', 'uint8'], [hatVaults, pid, account, tier]).slice(2), 'hex');
}
