import { useVaultsTotalPrices } from "hooks/vaults/useVaultsTotalPrices";
import { IVault } from "types";
import { generateColorsArrayInBetween } from "utils/colors.utils";

const INITIAL_SEVERITY_COLOR = "#24E8C5";
const FINAL_SEVERITY_COLOR = "#6652F7";

export const getSeveritiesColorsArray = (vault: IVault | undefined, levels = 4): string[] => {
  return generateColorsArrayInBetween(
    INITIAL_SEVERITY_COLOR,
    FINAL_SEVERITY_COLOR,
    vault?.description?.severities.length ?? levels
  );
};

export function useSeverityRewardInfo(vault: IVault | undefined, severityIndex: number) {
  const DEFAULT_VALUE = {
    rewards: { usd: 0, tokens: 0 },
    rewardsCap: { usd: 0, tokens: 0 },
    rewardPercentage: 0,
    rewardColor: INITIAL_SEVERITY_COLOR,
  };
  const { totalPrices } = useVaultsTotalPrices(vault ? vault.multipleVaults ?? [vault] : []);

  if (!vault || !vault.description) return DEFAULT_VALUE;

  const showIntendedAmounts = vault.amountsInfo?.showCompetitionIntendedAmount ?? false;
  const SEVERITIES_COLORS = getSeveritiesColorsArray(vault);

  if (vault.version === "v2") {
    const severity = vault.description.severities[severityIndex];
    if (!severity) return DEFAULT_VALUE;

    const sumTotalPrices = Object.values(totalPrices).reduce((a, b = 0) => a + b, 0);
    const rewardPercentage = +severity.percentage;

    const rewards = { usd: 0, tokens: 0 };
    const rewardsCap = { usd: 0, tokens: 0 };
    if (vault.multipleVaults && sumTotalPrices) {
      rewards.usd = sumTotalPrices * (rewardPercentage / 100);
    } else if (vault.amountsInfo?.tokenPriceUsd) {
      rewards.tokens =
        (showIntendedAmounts
          ? vault.amountsInfo.competitionIntendedAmount?.maxReward.tokens ?? 0
          : vault.amountsInfo.maxRewardAmount.tokens) *
        (rewardPercentage / 100);
      rewards.usd = rewards.tokens * vault.amountsInfo?.tokenPriceUsd;
      rewardsCap.tokens = severity.capAmount ?? 0; // Cap without maxRewardFactor
      // rewardsCap.tokens = (severity.capAmount ?? 0) * vault.amountsInfo?.maxRewardFactor;
      rewardsCap.usd = rewardsCap.tokens * vault.amountsInfo?.tokenPriceUsd;
    }

    const orderedSeverities = vault.description.severities.map((severity) => severity.percentage).sort((a, b) => a - b);
    const rewardColor: string = SEVERITIES_COLORS[orderedSeverities.indexOf(severity.percentage) ?? 0];

    return { rewards, rewardPercentage, rewardsCap, rewardColor };
  } else {
    const severity = vault.description.severities[severityIndex];
    if (!severity) return DEFAULT_VALUE;

    const sumTotalPrices = Object.values(totalPrices).reduce((a, b = 0) => a + b, 0);
    const rewardPercentage = (Number(vault.rewardsLevels[severity.index]) / 10000) * 100;

    const rewards = { usd: 0, tokens: 0 };
    const rewardsCap = { usd: 0, tokens: 0 };
    if (vault.multipleVaults && sumTotalPrices) {
      rewards.usd = sumTotalPrices * (rewardPercentage / 100);
    } else if (vault.amountsInfo?.tokenPriceUsd) {
      rewards.tokens =
        (showIntendedAmounts
          ? vault.amountsInfo.competitionIntendedAmount?.maxReward.tokens ?? 0
          : vault.amountsInfo.maxRewardAmount.tokens) *
        (rewardPercentage / 100);
      rewards.usd = rewards.tokens * vault.amountsInfo?.tokenPriceUsd;
    }

    const orderedSeverities = vault.description.severities.map((severity) => severity.index).sort((a, b) => a - b);
    const rewardColor: string = SEVERITIES_COLORS[orderedSeverities.indexOf(severity.index) ?? 0];

    return { rewards, rewardPercentage, rewardsCap, rewardColor };
  }
}
