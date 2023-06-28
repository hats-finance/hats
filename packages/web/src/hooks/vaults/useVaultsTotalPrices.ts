import { IVault } from "@hats-finance/shared";
import { formatUnits } from "ethers/lib/utils";

export function useVaultsTotalPrices(vaults: IVault[]) {
  const totalPrices: { [token: string]: number } = {};

  vaults.forEach((vault) => {
    const totalUSDValue =
      (vault.amountsInfo?.tokenPriceUsd ?? 0) * Number(formatUnits(vault.honeyPotBalance, vault.stakingTokenDecimals));

    totalPrices[vault.stakingToken] = totalUSDValue ?? 0;
  });

  return { totalPrices };
}
