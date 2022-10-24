import { useVaults } from "hooks/useVaults";
import { IVault } from "types/types";
import { useVaultsTotalPrices } from "./useVaultsTotalPrices";
import { formatUnits } from "ethers/lib/utils";

export function useSeverityReward(vault: IVault, index: number) {
  const { tokenPrices } = useVaults();
  const { totalPrices } = useVaultsTotalPrices(vault.multipleVaults ?? [vault]);

  if (vault.version === "v1") {
    const severity = vault.description.severities[index];
    const sumTotalPrices = Object.values(totalPrices).reduce((a, b = 0) => a + b, 0);
    const rewardPercentage = (Number(vault.rewardsLevels[severity.index]) / 10000) * 100;
    let rewardPrice: number = 0;
    if (vault.multipleVaults && sumTotalPrices) {
      rewardPrice = sumTotalPrices * (rewardPercentage / 100);
    } else if (tokenPrices?.[vault.stakingToken]) {
      rewardPrice = (Number(formatUnits(vault.honeyPotBalance, vault.stakingTokenDecimals)) * (rewardPercentage / 100) * tokenPrices[vault.stakingToken]);
    }
    return { rewardPrice, rewardPercentage }
  } else if (vault.version === "v2") {
    // TODO: implement v2 logic
  }

  return undefined;
}
