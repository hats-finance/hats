import { useVaults } from "hooks/vaults/useVaults";

/**
 * Returns the live/upcoming/finished audit competitions
 *
 * @remarks
 * The finished competitions are gotten from the payouts.
 */
export const useAuditCompetitionsVaults = () => {
  const { allVaultsOnEnv, allPayoutsOnEnv } = useVaults();
  const auditCompetitionsVaults =
    allVaultsOnEnv
      ?.filter((vault) => vault.registered)
      .filter((vault) => vault.description?.["project-metadata"].type === "audit") ?? [];

  const paidPayoutsFromAudits = allPayoutsOnEnv?.filter(
    (payout) => payout.isApproved && payout.payoutData?.vault?.description?.["project-metadata"].type === "audit"
  );

  auditCompetitionsVaults.sort((a, b) => (b.amountsInfo?.maxRewardAmount.usd ?? 0) - (a.amountsInfo?.maxRewardAmount.usd ?? 0));

  return {
    live: auditCompetitionsVaults?.filter((vault) => vault.dateStatus === "on_time") ?? [],
    upcoming: auditCompetitionsVaults?.filter((vault) => vault.dateStatus === "upcoming") ?? [],
    finished: paidPayoutsFromAudits ?? [],
  };
};

export const useBugBountiesVaults = () => {
  const { activeVaults } = useVaults();

  const bugBounties =
    activeVaults
      ?.filter((vault) => vault.registered)
      .filter(
        (vault) => !vault.description?.["project-metadata"].type || vault.description?.["project-metadata"].type === "normal"
      ) ?? [];

  bugBounties.sort((a, b) => (b.amountsInfo?.maxRewardAmount.usd ?? 0) - (a.amountsInfo?.maxRewardAmount.usd ?? 0));

  return bugBounties;
};
