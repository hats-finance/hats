import { useEthers } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import vaultAbi from "../data/abis/HATSVault.json";
import HatsToken from "../data/abis/HatsToken.json";

export function useActions() {
  const { library } = useEthers();
  const provider = library!;
  let signer;

  // only use signer if we have one
  try {
    signer = provider.getSigner();
  } catch (error) {
    console.error(error);
  }

  /**
   * Returns the HATS reward for a user
   * @param {string} address
   * @param {stirng} pid
   * @param {string} selectedAddress
   */
  const getPendingReward = async (address: string, pid: string, selectedAddress: string) => {
    try {
      const contract = new Contract(address, vaultAbi, signer);
      return await contract.pendingReward(pid, selectedAddress);
    } catch (error) {
      console.error(error);
      return BigNumber.from(0);
    }
  }

  /**
   * Get current votes for a given account
   * @param {string} address 
   * @param {string} rewardsToken 
   */
  const getCurrentVotes = async (address: string, rewardsToken: string) => {
    try {
      const contract = new Contract(rewardsToken, HatsToken, signer);
      return (await contract.getCurrentVotes(address) as BigNumber).toNumber();
    } catch (error) {
      console.error(error);
    }
  }

  /** Airdrop contract actions - END */

  return {
    getPendingReward,
    getCurrentVotes,
  }
}
