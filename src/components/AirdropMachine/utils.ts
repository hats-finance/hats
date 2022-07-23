import { useEthers } from "@usedapp/core";
import { useCallback, useEffect } from "react";
import { TEMP_WALLETS } from "./data";
import { solidityKeccak256 } from "ethers/lib/utils";
import { AirdropMachineWallet } from "types/types";
import { useDeadline, useTokenActions } from "hooks/tokenContractHooks";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

/**
 * TODO: need to fetch the JSON file from the IPFS
 */
export const getEligibilityData = async (address: string) => (
  TEMP_WALLETS.wallets.find(wallet => wallet.id === address)
)

export const useFetchAirdropData = async (toggleAirdropPrompt: () => void) => {
  const { account } = useEthers();
  const deadline = useDeadline();
  const { isTokenRedeemed } = useTokenActions();
  /**
   * TODO: temporary always show
   */
  const afterDeadline = false; // !deadline ? true : Date.now() > Number(deadline);

  const getAirdropData = useCallback(async () => {
    if (account) {
      const eligibaleData = await getEligibilityData(account);
      const somethingToRedeem = eligibaleData?.nft_elegebility.some(async (nft) => !(await isTokenRedeemed(nft.pid, nft.tier, eligibaleData.id))); 
      /**
       * TODO: check if we already notified the user in the local srorage?
       */
      if (eligibaleData && somethingToRedeem) {
        toggleAirdropPrompt();
      }
    }
  }, [account, toggleAirdropPrompt, isTokenRedeemed])

  useEffect(() => {
    (async () => {
      if (!afterDeadline) {
        await getAirdropData();
      }
    })();
  }, [account, afterDeadline]);
}

export const buildProofs = (data: AirdropMachineWallet) => {
  /**
   * The tree is built from ALL the data (including the redeemed NFTs)
   */
  const merkleTree = buildMerkleTree(TEMP_WALLETS.wallets);

  /**
   * Build the proofs only for the non-redeemed NFTs.
   * The data was already filtered in Redeem component.
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
