import { IVault, TokensPrices } from "types/types";
import { fromWei } from "utils";

/**
 * 
 * @param tokensPrices
 * @param vault 

 */
export const calculateUSDValue = (tokensPrices: TokensPrices, vault: IVault) => {
  return tokensPrices[vault.stakingToken] ? tokensPrices[vault.stakingToken] * Number(fromWei(vault.honeyPotBalance, vault.stakingTokenDecimals)) : undefined;
}

export const sumUSDValues = (tokensPrices: TokensPrices, vaults: IVault[]) => {
  let sum = 0;
  vaults.forEach(vault => {
    const usdValue = calculateUSDValue(tokensPrices, vault);
    if (usdValue) {
      sum += usdValue;
    }
  })
  return sum;
}

/**
 * Calculates the APY for a given vault
 * @param {IVault} vault
 * @param {number} hatsPrice
 */
 export const calculateApy = (vault: IVault, hatsPrice: number, tokenPrice: number) => {
  // TODO: If the divdier is 0 so we get NaN and then it shows "-". Need to decide if it's okay or show 0 in this case.
  if (Number(fromWei(vault.totalStaking)) === 0 || !tokenPrice) {
    return 0;
  }
  return (((Number(fromWei(vault.totalRewardPaid)) * Number(hatsPrice)) / Number(fromWei(vault.totalStaking))) * tokenPrice);
};
