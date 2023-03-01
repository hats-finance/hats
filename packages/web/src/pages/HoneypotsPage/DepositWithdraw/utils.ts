import { BigNumber } from "ethers";

/**
 * Calculates the value in tokens of a given amount of LP tokens
 */
export const calculateActualWithdrawValue = (
  amountAvailableToWithdraw?: BigNumber,
  userInput?: BigNumber,
  userShares?: BigNumber
): BigNumber | undefined => {
  if (!amountAvailableToWithdraw || !userInput || !userShares) return undefined;
  return userInput.mul(userShares).div(amountAvailableToWithdraw);
};
