import { useEthers } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { normalizeAddress } from "../utils";
import { NFT_AIRDROP_ADDRESS, TOKEN_AIRDROP_ADDRESS } from "../settings";
import vaultAbi from "../data/abis/HATSVault.json";
import NFTAirdrop from "../data/abis/NFTAirdrop.json";
import TokenAirdrop from "../data/abis/TokenAirdrop.json";
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


  /** Airdrop contract actions - START */

  /**
   * Get the merkle tree ref (eligible tokens)
   * @returns {string}
   */
  const getMerkleTree = async () => {
    try {
      const contract = new Contract(NFT_AIRDROP_ADDRESS, NFTAirdrop, signer);
      const data = contract.filters.MerkleTreeChanged();
      const filter = await contract.queryFilter(data, 0);
      if (filter) {
        const lastElement = filter[filter.length - 1] as any | undefined;
        return lastElement?.args?.merkleTreeIPFSRef;
      }
      return null
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Get the base URI
   */
  const getBaseURI = async () => {
    try {
      const contract = new Contract(NFT_AIRDROP_ADDRESS, NFTAirdrop, provider);
      return await contract.baseTokenURI();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Get the NFT Airdrop deadline
   * @returns {string} in unix time
   */
  const getDeadline = async () => {
    const contract = new Contract(NFT_AIRDROP_ADDRESS, NFTAirdrop, signer);
    return await contract.deadline();
  }

  /**
   * Redeem NFT
   * @param {string} account 
   * @param {string} tokenID 
   * @param {any} proof 
   */
  const redeemNFT = async (account: string, tokenID: string, proof: any) => {
    const contract = new Contract(NFT_AIRDROP_ADDRESS, NFTAirdrop, signer);
    return await contract.redeem(account, tokenID, proof);
  }

  /**
   * Check if a tokenId has already been redeemed by a given address.
   * NOTE: ERC721 contract function works it returns an error when the tokenId is not yet redeemed
   * for this reason in case of an exception we return false.
   * @param {string} tokenId
   * @param {string} address  
   */
  const isRedeemed = async (tokenId: string, address: string) => {
    const contract = new Contract(NFT_AIRDROP_ADDRESS, NFTAirdrop, signer);
    try {
      return normalizeAddress(await contract.ownerOf(tokenId)) === address;
    } catch (error) {
      return false;
    }
  }

  /**
   * Checks if a given address has claimed the token reward.
   * NOTE: ERC721 contract function works it returns an error when the address has not yet redeemed 
   * for this reason in case of an exception we return false.
   * @param {string} address
   */
  const hasClaimed = async (address: string) => {
    const contract = new Contract(TOKEN_AIRDROP_ADDRESS, TokenAirdrop, signer);
    try {
      return await contract.hasClaimed(address);
    } catch (error) {
      return false;
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
    getMerkleTree,
    getBaseURI,
    getDeadline,
    redeemNFT,
    isRedeemed,
    hasClaimed,
    getCurrentVotes,
  }
}
