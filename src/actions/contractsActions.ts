import { toWei, fromWei } from "../utils";
import { ethers, BigNumber, Contract, Signer } from "ethers";
import vaultAbi from "../data/abis/HATSVault.json";
import erc20Abi from "../data/abis/erc20.json";
import { TransactionStatus } from "../constants/constants";
import { Web3Provider } from "@ethersproject/providers";

let provider: Web3Provider;
let signer: Signer;

if (window.ethereum) {
  provider = new ethers.providers.Web3Provider((window as any).ethereum);
  signer = provider.getSigner();
}

/**
 * Given token address returns it's symbol
 * @param {string} tokenAddress
 */
export const getTokenSymbol = async (tokenAddress: string): Promise<string> => {
  const contract = new Contract(tokenAddress, erc20Abi, provider);
  return await contract.symbol();
}

/**
 * Given token address and current wallet account address returns the token balance
 * @param {string} tokenAddress
 * @param {string} selectedAddress
 */
export const getTokenBalance = async (tokenAddress: string, selectedAddress: string): Promise<string> => {
  const contract = new Contract(tokenAddress, erc20Abi, provider);
  const balance:BigNumber = await contract.balanceOf(selectedAddress);
  return fromWei(balance);
}

/**
 * Checks whether a given account address and a spender can spend a given token
 * @param {string} tokenAddress
 * @param {string} selectedAddress
 * @param {string} tokenSpender
 */
 export const isApproved = async (tokenAddress: string, selectedAddress: string, tokenSpender: string): Promise<boolean> => {
  const contract = new Contract(tokenAddress, erc20Abi, provider);
  const allowance:BigNumber = await contract.allowance(selectedAddress, tokenSpender);
  return allowance.gt(0);
}

/**
 * Approves a spender to spend a given token
 * @param {string} tokenAddress
 * @param {string} tokenSpender
 */
export const approveToken = async (tokenAddress: string, tokenSpender: string) => {
  const contract = new Contract(tokenAddress, erc20Abi, signer);
  return await contract.approve(tokenSpender, ethers.BigNumber.from(2).pow(255));
}

/**
 * Deposit
 * @param {string} address
 * @param {string} amount
 */
export const deposit = async (address: string, amount: string) => {
  const contract = new Contract(address, vaultAbi, signer);
  return await contract.stake(toWei(amount));
}

/**
 * Withdraw
 * @param {string} address
 * @param {string} amount
 */
 export const withdraw = async (address: string, amount: string) => {
  const contract = new Contract(address, vaultAbi, signer);
  return await contract.withdraw(toWei(amount));
}

/**
 * Claim
 * @param {stirng} address
 */
export const claim = async (address: string) => {
  const contract = new Contract(address, vaultAbi, signer);
  return await contract.getReward();
}

/**
 * Exit
 * @param {string} address
 */
export const exit = async (address: string) => {
  const contract = new Contract(address, vaultAbi, signer);
  return await contract.exit();
}

/**
 * This is a generic function that wraps a call that interacts with the blockchain
 * NEED TO ADD NOTIFICATION DISPATHCING
 * @param {Function} tx The function that creates the transaction on the blockchain
 * @param {Function} onSuccess Function to call on success
 * @param {Function} onFail Function to call on fail
 */
export const createTransaction = async (tx: Function, onSuccess: Function, onFail: Function) => {
  try {
    const transaction = await tx();
    const receipt = await transaction.wait();
    if (receipt.status === TransactionStatus.Success) {
      await onSuccess();
    } else {
      throw receipt;
    }
  } catch (error) {
    console.error(error);
    await onFail();
  }
}
