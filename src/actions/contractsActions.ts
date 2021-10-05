import { toWei, fromWei, checkMasterAddress } from "../utils";
import { ethers, BigNumber, Contract, Signer } from "ethers";
import vaultAbi from "../data/abis/HATSVault.json";
import erc20Abi from "../data/abis/erc20.json";
import NFTManagerABI from "../data/abis/NonfungiblePositionManager.json";
import UniswapV3Staker from "../data/abis/UniswapV3Staker.json";
import { DEFAULT_ERROR_MESSAGE, INCENTIVE_KEY_ABI, MAX_SPENDING, NFTMangerAddress, NotificationType, TransactionStatus, UNISWAP_V3_STAKER_ADDRESS } from "../constants/constants";
import { Dispatch } from "redux";
import { toggleInTransaction, toggleNotification } from "./index";
import { Logger } from "ethers/lib/utils";
import { NETWORK } from "../settings";
import { IIncentive } from "../types/types";

let provider: ethers.providers.Web3Provider;
let signer: Signer;

if (window.ethereum) {
  provider = new ethers.providers.Web3Provider((window as any).ethereum);
  signer = provider.getSigner();
}

/**
 * Returns the current block number
 */
export const getBlockNumber = async () => {
  try {
    return await provider.getBlockNumber();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Given token address returns it's symbol
 * @param {string} tokenAddress
 */
export const getTokenSymbol = async (tokenAddress: string) => {
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
export const getTokenBalance = async (tokenAddress: string, selectedAddress: string, decimals = "18") => {
  try {
    const contract = new Contract(tokenAddress, erc20Abi, provider);
    const balance: BigNumber = await contract.balanceOf(selectedAddress);
    return fromWei(balance, decimals);
  } catch (error) {
    console.error(error);
    return "-";
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
export const hasAllowance = async (tokenAddress: string, selectedAddress: string, tokenSpender: string, amount: string, stakingTokenDecimals: string) => {
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
export const approveToken = async (tokenAddress: string, tokenSpender: string, amountToSpend?: BigNumber) => {
  try {
    const contract = new Contract(tokenAddress, erc20Abi, signer);
    return await contract.approve(tokenSpender, amountToSpend ?? MAX_SPENDING);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Withdraw Request
 * @param {string} pid
 * @param {string} address
 */
export const withdrawRequest = async (pid: string, address: string) => {
  try {
    const contract = new Contract(address, vaultAbi, signer);
    return await contract.withdrawRequest(pid);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Deposit and claim (if acceptable)
 * @param {string} address
 * @param {string} amount
 */
export const depositAndClaim = async (pid: string, address: string, amount: string, decimals: string) => {
  checkMasterAddress(address);
  const contract = new Contract(address, vaultAbi, signer);
  return await contract.deposit(pid, toWei(amount, decimals));
}

/**
 * Withdraw and claim (if acceptable)
 * @param {string} pid
 * @param {string} address
 * @param {string} amount
 */
export const withdrawAndClaim = async (pid: string, address: string, amount: string) => {
  checkMasterAddress(address);
  const contract = new Contract(address, vaultAbi, signer);
  return await contract.withdraw(pid, amount);
}

/**
 * Claim
 * @param {stirng} address
 */
export const claim = async (pid: string, address: string) => {
  checkMasterAddress(address);
  const contract = new Contract(address, vaultAbi, signer);
  return await contract.claimReward(pid);
}

/**
 * Returns the HATS reward for a user
 * @param {string} address
 * @param {stirng} pid
 * @param {string} selectedAddress
 */
export const getPendingReward = async (address: string, pid: string, selectedAddress: string) => {
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
export const submitVulnerability = async (address: string, descriptionHash: string) => {
  checkMasterAddress(address);
  const contract = new Contract(address, vaultAbi, signer);
  return await contract.claim(descriptionHash);
}




/** Uniswap V3 Liquidity Pool contract actions - START */

/**
 * SafeTransferFrom in Uniswap V3 Liquidity Pool
 * Used when canWithdraw is false - meaning the token is not in the contract
 * @param {string} from 
 * @param {string} tokenID 
 * @param {IIncentive} incentive 
 */
export const uniswapSafeTransferFrom = async (from: string, tokenID: string, incentive: IIncentive) => {
  const contract = new Contract(NFTMangerAddress[NETWORK], NFTManagerABI, signer);
  const encodedData = ethers.utils.defaultAbiCoder.encode([INCENTIVE_KEY_ABI], [{
    pool: incentive.pool,
    startTime: incentive.startTime,
    endTime: incentive.endTime,
    rewardToken: incentive.rewardToken,
    refundee: incentive.refundee
  }]);
  return await contract.safeTransferFrom(from, UNISWAP_V3_STAKER_ADDRESS, Number(tokenID), encodedData);
}

/**
 * Stakes in Uniswap V3 Liquidity Pool
 * Used when canWithdraw is true - meaning the token is still in the contract
 * @param {string} tokenID 
 * @param {string} incentiveID 
 */
export const uniswapStake = async (tokenID: string, incentiveID: string) => {
  const contract = new Contract(UNISWAP_V3_STAKER_ADDRESS, UniswapV3Staker, signer);
  return await contract.stakeToken(tokenID, incentiveID);
}

/**
 * Unstakes in Uniswap V3 Liquidity Pool
 * @param {string} tokenID 
 * @param {IIncentive} incentive 
 */
export const uniswapUnstake = async (tokenID: string, incentive: IIncentive) => {
  const contract = new Contract(UNISWAP_V3_STAKER_ADDRESS, UniswapV3Staker, signer);
  return await contract.unstakeToken({
    pool: incentive.pool,
    startTime: incentive.startTime,
    endTime: incentive.endTime,
    rewardToken: incentive.rewardToken,
    refundee: incentive.refundee
  }, Number(tokenID));
}

/**
 * Claims in Uniswap V3 Liquidity Pool
 * @param {string} rewardToken
 * @param {string} from
 */
export const uniswapClaimReward = async (rewardToken: string, from: string) => {
  const contract = new Contract(UNISWAP_V3_STAKER_ADDRESS, UniswapV3Staker, signer);
  return await contract.claimReward(rewardToken, from, 0); // zero means claiming anything available
}

/**
 * Withdraws Token in Uniswap V3 Liquidity Pool
 * @param {string} tokenID
 * @param {string} to
 */
export const uniswapWithdrawToken = async (tokenID: string, to: string) => {
  const contract = new Contract(UNISWAP_V3_STAKER_ADDRESS, UniswapV3Staker, signer);
  return await contract.withdrawToken(tokenID, to, "0x");
}

/**
 * Gets the accrued rewards in Uniswap V3 Liquidity Pool
 * @param {string} rewardToken 
 * @param {string} userAddress
 */
export const uniswapRewards = async (rewardToken: string, userAddress: string) => {
  const contract = new Contract(UNISWAP_V3_STAKER_ADDRESS, UniswapV3Staker, signer);
  return await contract.rewards(rewardToken, userAddress);
}

/**
 * 
 * @param {string} tokenID
 * @param {string} incentiveID
 */
export const uniswapGetRewardInfo = async(tokenID: string, incentiveID: string) => {
  const contract = new Contract(UNISWAP_V3_STAKER_ADDRESS, UniswapV3Staker, signer);
  return await contract.getRewardInfo();
}

/** Uniswap V3 Liquidity Pool contract actions - END */




/**
 * This is a generic function that wraps a call that interacts with the blockchain.
 * Dispatches automatically a notification on success or on error.
 * Uses the transactionWait function to wait for a transaction status.
 * @param {Function} tx The function that creates the transaction on the blockchain
 * @param {Function} onSuccess Function to call on success
 * @param {Function} onWalletAction Function to call while a transaction is being processed
 * @param {Function} onFail Function to call on fail
 * @param {Dispatch} dispatch The Redux dispath function to dispatch the notification
 * @param {string} successText Optional extra text to show on success
 * @param {number} confirmations The number of confirmations on the blockchain to wait until we consider the transaction has succeeded. Default is 1 confirmation.
 * @param {boolean} disableAutoHide Disable auto-hide of the notifications
 */
export const createTransaction = async (tx: Function, onWalletAction: Function, onSuccess: Function, onFail: Function, dispatch: Dispatch, successText?: string, confirmations = 1, disableAutoHide?: boolean) => {
  try {
    dispatch(toggleNotification(false, undefined, ""));
    const transaction = await tx();
    await onWalletAction();
    if (transaction) {
      dispatch(toggleInTransaction(true, transaction.hash));
      const transactionStatus = await transactionWait(transaction, confirmations);
      if (transactionStatus === TransactionStatus.Success) {
        await onSuccess();
        dispatch(toggleNotification(true, NotificationType.Success, successText ?? "Transaction succeeded", disableAutoHide));
        dispatch(toggleInTransaction(false));
      } else if (transactionStatus === TransactionStatus.Cancelled) {
        await onFail();
        dispatch(toggleNotification(true, NotificationType.Info, "Transaction was cancelled", disableAutoHide));
        dispatch(toggleInTransaction(false));
      } else {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }
    } else {
      throw new Error(DEFAULT_ERROR_MESSAGE);
    }
  } catch (error: any) {
    console.error(error);
    await onFail();
    dispatch(toggleNotification(true, NotificationType.Error, error?.error?.message ?? error?.message ?? DEFAULT_ERROR_MESSAGE, disableAutoHide));
    dispatch(toggleInTransaction(false));
  }
}

/**
 * Wait for a transaction result.
 * If the transaction is failed and it's not a user cancellation (e.g. tx speed-up) 
 * so we call recursively to transactionWait to get the new tx hash and wait again for a result.
 * @param {any} tx
 * @param {number} confirmations
 * @returns {TransactionStatus}
 */
const transactionWait = async (tx: any, confirmations = 1): Promise<TransactionStatus> => {
  try {
    const receipt = await tx.wait(confirmations);
    if (receipt.status === TransactionStatus.Success) {
      return TransactionStatus.Success;
    }
  } catch (error: any) {
    if (error.code === Logger.errors.TRANSACTION_REPLACED) {
      if (error.cancelled) {
        return TransactionStatus.Cancelled;
      } else {
        return await transactionWait(error.replacement, confirmations);
      }
    }
  }
  return TransactionStatus.Fail;
}
