import { useVaults } from "hooks/vaults/useVaults";

export const useAuditCompetitionsVaults = () => {
  const { allVaultsOnEnv } = useVaults();
  const auditCompetitions =
    allVaultsOnEnv
      ?.filter((vault) => vault.registered)
      .filter((vault) => vault.description?.["project-metadata"].type === "audit") ?? [];

  auditCompetitions.sort((a, b) => (b.maxRewardAmount?.value ?? 0) - (a.maxRewardAmount?.value ?? 0));

  return {
    live: auditCompetitions?.filter((vault) => vault.dateStatus === "on_time") ?? [],
    upcoming: auditCompetitions?.filter((vault) => vault.dateStatus === "upcoming") ?? [],
    finished: auditCompetitions?.filter((vault) => vault.dateStatus === "finished") ?? [],
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

  bugBounties.sort((a, b) => (b.maxRewardAmount?.value ?? 0) - (a.maxRewardAmount?.value ?? 0));

  return bugBounties;
};
