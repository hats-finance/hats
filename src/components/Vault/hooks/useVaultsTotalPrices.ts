import { useVaults } from "hooks/useVaults";
import { IVault } from "types/types";
import { fromWei } from "utils";

export function useVaultsTotalPrices(vaults: IVault[]) {
  const { tokenPrices } = useVaults();

  const totalPrices: { [token: string]: number } = {};

  vaults.forEach(vault => {
    const totalUSDValue = tokenPrices?.[vault.stakingToken] ? tokenPrices[vault.stakingToken] * Number(fromWei(vault.honeyPotBalance, vault.stakingTokenDecimals)) : undefined;
    if (totalUSDValue) {
      totalPrices[vault.stakingToken] = totalUSDValue;
    }
  })

  return { totalPrices };
}
