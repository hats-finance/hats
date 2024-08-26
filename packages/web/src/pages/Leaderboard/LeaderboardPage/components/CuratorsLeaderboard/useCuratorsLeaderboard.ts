import { IHackerProfile, IVaultV3, getOldTokenPrice } from "@hats.finance/shared";
import { ethers } from "ethers";
import { IPayoutsTimeframe } from "hooks/leaderboard/usePayoutsGroupedByAddress";
import { usePayoutsGroupedByCurator } from "hooks/leaderboard/usePayoutsGroupedByCurator";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useAllProfiles } from "pages/HackerProfile/useCachedProfile";
import { useMemo, useState } from "react";

export type ICuratorsLeaderboardSortKey = "competitions" | "competitionsRewards" | "earnedFees";

export type ICuratorsLeaderboard = {
  address: string;
  profile?: IHackerProfile;
  totalAmountCompetitionsPaid: { tokens: number; usd: number };
  totalAmountEarned: { tokens: number; usd: number };
  totalCompetitions: number;
}[];

export const useCuratorsLeaderboard = (
  timeframe: IPayoutsTimeframe = "all",
  sortKey: ICuratorsLeaderboardSortKey = "competitions"
): { leaderboard: ICuratorsLeaderboard; isLoading: boolean } => {
  const payoutsGroupedByCurator = usePayoutsGroupedByCurator(timeframe);
  const { vaultsReadyAllChains } = useVaults();
  const { data: profiles } = useAllProfiles();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const payoutsWithStats = useMemo(() => {
    if (!vaultsReadyAllChains || !profiles) return [];

    // Iterate over each entry on payoutsGroupedByAddress and calculate stats (total amount, total submissions and highest severity)
    const payoutsGroupedByAddressWithStats = Object.entries(payoutsGroupedByCurator).map(([address, payouts]) => {
      return payouts.reduce(
        (acc, payout) => {
          const vault = payout.vaultData;
          if (!vault || !vault.description) return acc;

          const curator = payout.payoutData?.curator;
          if (!curator) return acc;

          const vaultVersion = vault.version;
          if (vaultVersion !== "v3") return acc;

          const isAudit = vault.description?.["project-metadata"].type === "audit";

          const totalRewardInTokens = +ethers.utils.formatUnits(payout.totalPaidOut ?? "0", vault.stakingTokenDecimals);
          // If audit comp and no token price, assume the token price is 1 because is stable coin. If not, dont calculate the usd value
          const tokenPrice =
            payout.payoutData?.vault?.amountsInfo?.tokenPriceUsd ?? getOldTokenPrice(payout.id) ?? (isAudit ? 1 : 0);

          const govPercentage =
            (payout.payoutData?.vault as IVaultV3 | undefined)?.description?.parameters.fixedHatsGovPercetange ?? 0;
          const curatorPercentage = (govPercentage / 100) * (curator.percentage / 100);
          acc.totalAmountCompetitionsPaid.tokens += totalRewardInTokens;
          acc.totalAmountCompetitionsPaid.usd += totalRewardInTokens * tokenPrice;
          acc.totalAmountEarned.tokens += acc.totalAmountCompetitionsPaid.tokens * curatorPercentage;
          acc.totalAmountEarned.usd += acc.totalAmountCompetitionsPaid.usd * curatorPercentage;
          acc.totalCompetitions += 1;
          acc.profile = profiles.find((prof) => prof.addresses.map((address) => address.toLowerCase()).includes(address));

          return acc;
        },
        {
          address,
          profile: undefined,
          totalAmountCompetitionsPaid: { tokens: 0, usd: 0 },
          totalAmountEarned: { tokens: 0, usd: 0 },
          totalCompetitions: 0,
        } as ICuratorsLeaderboard[0]
      );
    });

    setIsLoading(false);

    if (sortKey === "competitions") {
      return payoutsGroupedByAddressWithStats.sort(
        (a, b) =>
          b.totalCompetitions - a.totalCompetitions ||
          (b.totalAmountCompetitionsPaid.usd ?? 0) - (a.totalAmountCompetitionsPaid.usd ?? 0)
      );
    } else if (sortKey === "competitionsRewards") {
      return payoutsGroupedByAddressWithStats.sort(
        (a, b) =>
          b.totalAmountCompetitionsPaid.usd - a.totalAmountCompetitionsPaid.usd || b.totalCompetitions - a.totalCompetitions
      );
    } else {
      return payoutsGroupedByAddressWithStats.sort(
        (a, b) => (b.totalAmountEarned.usd ?? 0) - (a.totalAmountEarned.usd ?? 0) || b.totalCompetitions - a.totalCompetitions
      );
    }
  }, [payoutsGroupedByCurator, vaultsReadyAllChains, sortKey, profiles]);

  return { leaderboard: payoutsWithStats, isLoading };
};
