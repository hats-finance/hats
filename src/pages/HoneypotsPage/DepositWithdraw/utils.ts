import { BigNumber } from "@ethersproject/bignumber";

/**
 * Calculates the value we send to the contract when a user wants to withdraw
 * @param {BigNumber} amountAvailableToWithdraw
 * @param {string} userInput The actual number the user insterted
 * @param {BigNumber} userShares
 * @param {string} decimals
 */
export const calculateActualWithdrawValue = (
  amountAvailableToWithdraw?: BigNumber,
  userInput?: BigNumber,
  userShares?: BigNumber
): BigNumber | undefined => {
  if (!amountAvailableToWithdraw || !userInput || !userShares) return undefined;
  return userInput.mul(userShares).div(amountAvailableToWithdraw);
};
