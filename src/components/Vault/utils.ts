import { IVault } from "types/types";
import { fromWei } from "utils";

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
