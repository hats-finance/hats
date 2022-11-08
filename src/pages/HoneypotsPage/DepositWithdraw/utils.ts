import { BigNumber } from "@ethersproject/bignumber";

/**
 * Calculates the value in tokens of a given amount of LP tokens
 */
export const calculateWithdrawSharesValue = (
  userShares?: BigNumber,
  honeyPotBalance?: BigNumber,
  totalUserShares?: BigNumber
): BigNumber | undefined => {
  if (!honeyPotBalance || !totalUserShares || !userShares) return undefined;
  if (totalUserShares.eq(0)) return BigNumber.from(0);
  return userShares.mul(honeyPotBalance).div(totalUserShares);
};

/**
 * Calculates the value in shares of a given amount of tokens
 */
export const calculateSharesFromTokenAmount = (
  userInputTokens?: BigNumber,
  honeyPotBalance?: BigNumber,
  totalUserShares?: BigNumber
): BigNumber | undefined => {
  if (!honeyPotBalance || !totalUserShares || !userInputTokens) return undefined;
  if (honeyPotBalance.eq(0)) return BigNumber.from(0);
  return userInputTokens.mul(totalUserShares).div(honeyPotBalance);
};
