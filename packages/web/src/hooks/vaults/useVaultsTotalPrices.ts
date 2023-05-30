import { formatUnits } from "ethers/lib/utils";
import { useVaults } from "hooks/vaults/useVaults";
import { IVault } from "types";

export function useVaultsTotalPrices(vaults: IVault[]) {
  const { tokenPrices } = useVaults();

  const totalPrices: { [token: string]: number } = {};

  vaults.forEach((vault) => {
    const totalUSDValue = tokenPrices?.[vault.stakingToken]
      ? tokenPrices[vault.stakingToken] * Number(formatUnits(vault.honeyPotBalance, vault.stakingTokenDecimals))
      : undefined;

    totalPrices[vault.stakingToken] = totalUSDValue ?? 0;
  });

  return { totalPrices };
}
