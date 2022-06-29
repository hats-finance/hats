import { useVaults } from "hooks/useVaults";
import { IVault } from "types/types";
import { fromWei } from "utils";
import { useVaultsTotalPrices } from "./useVaultsTotalPrices";

export function useSeverityReward(vault: IVault, severityIndex: number) {
  const { tokenPrices } = useVaults();
  const { totalPrices } = useVaultsTotalPrices(vault.multipleVaults ?? [vault]);
  const sumTotalPrices = Object.values(totalPrices).reduce((a, b = 0) => a + b, 0);
  const rewardPercentage = (Number(vault.rewardsLevels[severityIndex]) / 10000) * 100;

  if (vault.multipleVaults && sumTotalPrices) {
    return sumTotalPrices * (rewardPercentage / 100);
  } else if (tokenPrices?.[vault.stakingToken]) {
    return (Number(fromWei(vault.honeyPotBalance, vault.stakingTokenDecimals)) * (rewardPercentage / 100) * tokenPrices[vault.stakingToken]);
  }
  return undefined;
}
