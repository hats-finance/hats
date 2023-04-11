import { BigNumber } from "ethers";
import millify from "millify";
import { IVault } from "@hats-finance/shared";
import { Amount } from "utils/amounts.utils";

export const calculateAmountInTokensFromPercentage = (
  percentageToPay: string | undefined,
  vault: IVault | undefined,
  tokenPrices: number[] | undefined
): string => {
  if (!vault || !percentageToPay || isNaN(+percentageToPay)) return "-";

  const tokenAddress = vault.stakingToken;
  const tokenSymbol = vault.stakingTokenSymbol;
  const tokenDecimals = vault.stakingTokenDecimals;
  const vaultBalance = new Amount(BigNumber.from(vault.honeyPotBalance), tokenDecimals, tokenSymbol).number;
  const amountInTokens = vaultBalance * (+percentageToPay / 100);

  const tokenPrice = tokenPrices?.[tokenAddress] ?? 0;

  return `≈ ${millify(amountInTokens)} ${tokenSymbol} ~ ${millify(amountInTokens * tokenPrice)}$`;
};
