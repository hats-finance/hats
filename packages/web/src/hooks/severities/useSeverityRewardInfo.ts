import { formatUnits } from "ethers/lib/utils";
import { useVaults } from "hooks/vaults/useVaults";
import { useVaultsTotalPrices } from "hooks/vaults/useVaultsTotalPrices";
import { IVault } from "types";
import { generateColorsArrayInBetween } from "utils/colors.utils";

const INITIAL_SEVERITY_COLOR = "#24E8C5";
const FINAL_SEVERITY_COLOR = "#6652F7";

export function useSeverityRewardInfo(vault: IVault | undefined, severityIndex: number) {
  const { tokenPrices } = useVaults();
  const { totalPrices } = useVaultsTotalPrices(vault && vault.multipleVaults ? [vault] : []);

  if (!vault || !vault.description) return { rewardPrice: 0, rewardPercentage: 0, rewardColor: INITIAL_SEVERITY_COLOR };

  const SEVERITIES_COLORS = generateColorsArrayInBetween(
    INITIAL_SEVERITY_COLOR,
    FINAL_SEVERITY_COLOR,
    vault.description.severities.length
  );

  if (vault.version === "v2") {
    const severity = vault.description.severities[severityIndex];
    const sumTotalPrices = Object.values(totalPrices).reduce((a, b = 0) => a + b, 0);
    const maxBountyPercentage = Number(vault.maxBounty) / 10000; // Number between 0 and 1;
    const rewardPercentage = +severity.percentage * maxBountyPercentage;

    let rewardPrice: number = 0;
    if (vault.multipleVaults && sumTotalPrices) {
      rewardPrice = sumTotalPrices * (rewardPercentage / 100);
    } else if (tokenPrices?.[vault.stakingToken]) {
      rewardPrice =
        Number(formatUnits(vault.honeyPotBalance, vault.stakingTokenDecimals)) *
        (rewardPercentage / 100) *
        tokenPrices[vault.stakingToken];
    }

    const orderedSeverities = vault.description.severities.map((severity) => severity.percentage).sort((a, b) => a - b);
    const rewardColor: string = SEVERITIES_COLORS[orderedSeverities.indexOf(severity.percentage) ?? 0];

    return { rewardPrice, rewardPercentage, rewardColor };
  } else {
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

    const orderedSeverities = vault.description.severities.map((severity) => severity.index).sort((a, b) => a - b);
    const rewardColor: string = SEVERITIES_COLORS[orderedSeverities.indexOf(severity.index) ?? 0];

    return { rewardPrice, rewardPercentage, rewardColor };
  }
}
