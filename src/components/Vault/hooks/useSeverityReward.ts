import { useVaults } from "hooks/useVaults";
import { IVault } from "types/types";
import { useVaultsTotalPrices } from "./useVaultsTotalPrices";
import { formatUnits } from "ethers/lib/utils";
import { VAULTS_TYPE_SEVERITIES_COLORS } from "constants/constants";

const defaultColor = VAULTS_TYPE_SEVERITIES_COLORS["normal"][0];

export function useSeverityReward(vault: IVault, severityIndex: number) {
  const { tokenPrices } = useVaults();
  const { totalPrices } = useVaultsTotalPrices(vault.multipleVaults ?? [vault]);

  if (vault.version === "v2") {
    // TODO: implement v2 logic
    return { rewardPrice: 0, rewardPercentage: 0, rewardColor: defaultColor };
  } else {
    if (!vault.description) return { rewardPrice: 0, rewardPercentage: 0, rewardColor: defaultColor };

    const severity = vault.description.severities[severityIndex];
    const sumTotalPrices = Object.values(totalPrices).reduce((a, b = 0) => a + b, 0);
    const rewardPercentage = (Number(vault.rewardsLevels[severity.index]) / 10000) * 100;

    let rewardPrice: number = 0;
    if (vault.multipleVaults && sumTotalPrices) {
      rewardPrice = sumTotalPrices * (rewardPercentage / 100);
    } else if (tokenPrices?.[vault.stakingToken]) {
      rewardPrice =
        Number(formatUnits(vault.honeyPotBalance, vault.stakingTokenDecimals)) *
        (rewardPercentage / 100) *
        tokenPrices[vault.stakingToken];
    }

    const projectType = vault.description?.["project-metadata"].type ?? "normal";

    const orderedSeverities = vault.description.severities.map((severity) => severity.index).sort((a, b) => a - b);
    const severitiesColors = VAULTS_TYPE_SEVERITIES_COLORS[projectType];
    const rewardColor = severitiesColors[orderedSeverities.indexOf(severity.index) ?? 0];

    return { rewardPrice, rewardPercentage, rewardColor };
  }
}
