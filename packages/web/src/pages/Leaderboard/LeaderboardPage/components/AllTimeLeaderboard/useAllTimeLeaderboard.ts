import { ethers } from "ethers";
import { usePayoutsGroupedByAddress } from "hooks/leaderboard";
import { IPayoutsTimeframe } from "hooks/leaderboard/usePayoutsGroupedByAddress";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { severitiesOrder } from "pages/HackerProfile/constants";
import { useMemo, useState } from "react";
import { getOldTokenPrice } from "utils/getOldTokenPrice";
import { parseSeverityName } from "utils/severityName";

export type IAllTimeLeaderboard = {
  address: string;
  payouts: any[];
  totalAmount: { tokens: number; usd: number };
  totalSubmissions: number;
  highestSeverity: string;
}[];

export const useAllTimeLeaderboard = (
  timeframe: IPayoutsTimeframe = "all"
): { leaderboard: IAllTimeLeaderboard; isLoading: boolean } => {
  const payoutsGroupedByAddress = usePayoutsGroupedByAddress(timeframe);
  const { vaultsReadyAllChains } = useVaults();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const payoutsWithStats = useMemo(() => {
    if (!vaultsReadyAllChains) return [];

    // Iterate over each entry on payoutsGroupedByAddress and calculate stats (total amount, total submissions and highest severity)
    const payoutsGroupedByAddressWithStats = Object.entries(payoutsGroupedByAddress).map(([address, payouts]) => {
      return payouts.reduce(
        (acc, payout) => {
          const vault = payout.vaultData;
          if (!vault || !vault.description) return acc;
          const isAudit = vault.description?.["project-metadata"].type === "audit";

          const totalRewardInTokens = +ethers.utils.formatUnits(payout.totalPaidOut ?? "0", vault.stakingTokenDecimals);
          // If audit comp and no token price, assume the token price is 1 because is stable coin. If not, dont calculate the usd value
          const tokenPrice =
            payout.payoutData?.vault?.amountsInfo?.tokenPriceUsd ?? getOldTokenPrice(payout.id) ?? (isAudit ? 1 : 0);

          if (payout.payoutData?.type === "single") {
            const findingSeverityName = parseSeverityName(payout.payoutData.severity);

            acc.totalAmount.tokens += totalRewardInTokens;
            acc.totalAmount.usd += totalRewardInTokens * tokenPrice;
            acc.totalSubmissions += 1;
            acc.highestSeverity =
              severitiesOrder.indexOf(findingSeverityName) > severitiesOrder.indexOf(acc.highestSeverity)
                ? findingSeverityName
                : acc.highestSeverity;
          } else if (payout.payoutData?.type === "split") {
            for (const ben of payout.payoutData.beneficiaries) {
              if (address.toLowerCase() !== ben.beneficiary.toLowerCase()) continue;
              // Total percentage paid out to all beneficiaries (usually 100%)
              const totalPercentage = payout.payoutData.beneficiaries.reduce(
                (acc, curr) => acc + Number(curr.percentageOfPayout),
                0
              );
              const findingRewardInTokens = (Number(ben.percentageOfPayout) / totalPercentage) * totalRewardInTokens;

              const findingSeverityName = parseSeverityName(ben.severity);

              acc.totalAmount.tokens += findingRewardInTokens;
              acc.totalAmount.usd += findingRewardInTokens * tokenPrice;
              acc.totalSubmissions += 1;
              acc.highestSeverity =
                severitiesOrder.indexOf(findingSeverityName) > severitiesOrder.indexOf(acc.highestSeverity)
                  ? findingSeverityName
                  : acc.highestSeverity;
            }
          }

          return acc;
        },
        {
          address,
          payouts,
          totalAmount: { tokens: 0, usd: 0 },
          totalSubmissions: 0,
          highestSeverity: "",
        }
      );
    });

    setIsLoading(false);
    return payoutsGroupedByAddressWithStats.sort((a, b) => (a.totalAmount.usd > b.totalAmount.usd ? -1 : 1));
  }, [payoutsGroupedByAddress, vaultsReadyAllChains]);

  return { leaderboard: payoutsWithStats, isLoading };
};
