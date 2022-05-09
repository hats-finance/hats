import { useEthers } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { toWei, fromWei, checkMasterAddress, normalizeAddress } from "../utils";
import { MAX_SPENDING } from "../constants/constants";
import { NFT_AIRDROP_ADDRESS, TOKEN_AIRDROP_ADDRESS } from "../settings";
import vaultAbi from "../data/abis/HATSVault.json";
import erc20Abi from "../data/abis/erc20.json";
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
   * @returns The current block number
   */
  const getBlockNumber = async () => {
    try {
      return await provider.getBlockNumber();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Given an hexadecimal address returns it's ENS
   * @param {string} address
   */
  const resolveENS = async (address: string) => {
    try {
      return await provider.lookupAddress(address);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Given token address returns it's symbol
   * @param {string} tokenAddress
   */
  const getTokenSymbol = async (tokenAddress: string) => {
    try {
      const contract = new Contract(tokenAddress, erc20Abi, provider);
      return await contract.symbol();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Given token address and current wallet account address returns the token balance
   * @param {string} tokenAddress
   * @param {string} selectedAddress
   */
  const getTokenBalance = async (tokenAddress: string, selectedAddress: string, decimals = "18") => {
    try {
      const contract = new Contract(tokenAddress, erc20Abi, provider);
      const balance: BigNumber = await contract.balanceOf(selectedAddress);
      return fromWei(balance, decimals);
    } catch (error) {
      console.error(error);
      return "0";
    }
  }

  /**
   * Checks whether a given account address and a spender can spend amount of a given token
   * @param {string} tokenAddress
   * @param {string} selectedAddress
   * @param {string} tokenSpender
   * @param {stirng} amount
   * @param {string} stakingTokenDecimals
   */
  const hasAllowance = async (tokenAddress: string, selectedAddress: string, tokenSpender: string, amount: string, stakingTokenDecimals: string) => {
    try {
      const contract = new Contract(tokenAddress, erc20Abi, provider);
      const allowance: BigNumber = await contract.allowance(selectedAddress, tokenSpender);
      return allowance.gte(BigNumber.from(toWei(amount, stakingTokenDecimals)));
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Approves a spender to spend amount of a given token. If no amount given, spending the MAX_SPENDING by default. 
   * @param {string} tokenAddress
   * @param {string} tokenSpender
   * @param {BigNumber} amountToSpend
   */
  const approveToken = async (tokenAddress: string, tokenSpender: string, amountToSpend?: BigNumber) => {
    try {
      const contract = new Contract(tokenAddress, erc20Abi, signer);
      return await contract.approve(tokenSpender, amountToSpend ?? MAX_SPENDING);
    } catch (error) {
      console.error(error);
    }
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
   * Submits the hash of the vulnerability description
   * @param {string} address
   * @param {string} descriptionHash the sha256 of the vulnerability description
   */
  const submitVulnerability = async (address: string, descriptionHash: string) => {
    checkMasterAddress(address);
    const contract = new Contract(address, vaultAbi, signer);
    return await contract.claim(descriptionHash);
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
      return (filter[filter.length - 1].args as any).merkleTreeIPFSRef;
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
      console.log(error);
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
   * Check if a tokenID has already been redeemed by a given address.
   * @param {string} tokenID 
   * @param {string} address  
   */
  const isRedeemed = async (tokenID: string, address: string) => {
    const contract = new Contract(NFT_AIRDROP_ADDRESS, NFTAirdrop, signer);
    try {
      return normalizeAddress(await contract.ownerOf(tokenID)) === address;
    } catch (error) {
      return false;
    }
  }

  /**
   * Checks if a given address has claimed the token reward.
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
    getBlockNumber,
    resolveENS,
    getTokenSymbol,
    getTokenBalance,
    hasAllowance,
    approveToken,
    getPendingReward,
    submitVulnerability,
    getMerkleTree,
    getBaseURI,
    getDeadline,
    redeemNFT,
    isRedeemed,
    hasClaimed,
    getCurrentVotes,
  }
}
