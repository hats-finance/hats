import { useVaultsTotalPrices } from "hooks/vaults/useVaultsTotalPrices";
import { IVault } from "types";
import { generateColorsArrayInBetween } from "utils/colors.utils";

const INITIAL_SEVERITY_COLOR = "#24E8C5";
const FINAL_SEVERITY_COLOR = "#6652F7";

export const getSeveritiesColorsArray = (vault: IVault | undefined): string[] => {
  if (!vault || !vault?.description?.severities) return [];

  return generateColorsArrayInBetween(INITIAL_SEVERITY_COLOR, FINAL_SEVERITY_COLOR, vault.description.severities.length ?? 4);
};

export function useSeverityRewardInfo(vault: IVault | undefined, severityIndex: number) {
  const { totalPrices } = useVaultsTotalPrices(vault ? vault.multipleVaults ?? [vault] : []);

  if (!vault || !vault.description)
    return { rewardPrice: 0, rewardPercentage: 0, rewardCap: 0, rewardColor: INITIAL_SEVERITY_COLOR };

  const showIntendedAmounts = vault.amountsInfo?.showCompetitionIntendedAmount ?? false;
  const SEVERITIES_COLORS = getSeveritiesColorsArray(vault);

  if (vault.version === "v2") {
    const severity = vault.description.severities[severityIndex];
    if (!severity) return { rewardPrice: 0, rewardPercentage: 0, rewardCap: 0, rewardColor: INITIAL_SEVERITY_COLOR };

    const sumTotalPrices = Object.values(totalPrices).reduce((a, b = 0) => a + b, 0);
    const rewardPercentage = +severity.percentage;

    let rewardPrice: number = 0;
    let rewardCap: number = 0;
    if (vault.multipleVaults && sumTotalPrices) {
      rewardPrice = sumTotalPrices * (rewardPercentage / 100);
    } else if (vault.amountsInfo?.tokenPriceUsd) {
      rewardPrice =
        (showIntendedAmounts
          ? vault.amountsInfo.competitionIntendedAmount?.deposited.tokens ?? 0
          : vault.amountsInfo.maxRewardAmount.tokens) *
        (rewardPercentage / 100) *
        vault.amountsInfo?.tokenPriceUsd;
      rewardCap = (severity.capAmount ?? 0) * vault.amountsInfo?.tokenPriceUsd;
    }

    const orderedSeverities = vault.description.severities.map((severity) => severity.percentage).sort((a, b) => a - b);
    const rewardColor: string = SEVERITIES_COLORS[orderedSeverities.indexOf(severity.percentage) ?? 0];

    return { rewardPrice, rewardPercentage, rewardCap, rewardColor };
  } else {
    const severity = vault.description.severities[severityIndex];
    if (!severity) return { rewardPrice: 0, rewardPercentage: 0, rewardCap: 0, rewardColor: INITIAL_SEVERITY_COLOR };

    const sumTotalPrices = Object.values(totalPrices).reduce((a, b = 0) => a + b, 0);
    const rewardPercentage = (Number(vault.rewardsLevels[severity.index]) / 10000) * 100;

    let rewardPrice: number = 0;
    let rewardCap: number = 0;
    if (vault.multipleVaults && sumTotalPrices) {
      rewardPrice = sumTotalPrices * (rewardPercentage / 100);
    } else if (vault.amountsInfo?.tokenPriceUsd) {
      rewardPrice =
        (showIntendedAmounts
          ? vault.amountsInfo.competitionIntendedAmount?.deposited.tokens ?? 0
          : vault.amountsInfo.maxRewardAmount.tokens) *
        (rewardPercentage / 100) *
        vault.amountsInfo?.tokenPriceUsd;
    }

    const orderedSeverities = vault.description.severities.map((severity) => severity.index).sort((a, b) => a - b);
    const rewardColor: string = SEVERITIES_COLORS[orderedSeverities.indexOf(severity.index) ?? 0];

    return { rewardPrice, rewardPercentage, rewardCap, rewardColor };
  }
}
