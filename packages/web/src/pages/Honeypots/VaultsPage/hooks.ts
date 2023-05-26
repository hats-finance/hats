import { useVaults } from "hooks/vaults/useVaults";

export const useAuditCompetitionsVaults = () => {
  const { allVaultsOnEnv } = useVaults();
  const auditCompetitions = allVaultsOnEnv?.filter((vault) => vault.description?.["project-metadata"].type === "audit") ?? [];

  return {
    live: auditCompetitions?.filter((vault) => vault.dateStatus === "on_time") ?? [],
    upcoming: auditCompetitions?.filter((vault) => vault.dateStatus === "upcoming") ?? [],
    finished: auditCompetitions?.filter((vault) => vault.dateStatus === "finished") ?? [],
  };
};

export const useBugBountiesVaults = () => {
  const { activeVaults } = useVaults();
  const bugBounties =
    activeVaults?.filter(
      (vault) => !vault.description?.["project-metadata"].type || vault.description?.["project-metadata"].type === "normal"
    ) ?? [];

  return bugBounties;
};
