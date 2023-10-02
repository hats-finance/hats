import { Seo, VaultAuditDraftCard, VaultCard, VaultCardSkeleton } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useTranslation } from "react-i18next";
import { useAuditCompetitionsVaults, useDraftAuditCompetitions, useOldAuditCompetitions } from "./hooks";
import { StyledVaultsPage } from "./styles";

export const AuditVaultsPage = () => {
  const { t } = useTranslation();
  const { vaultsReadyAllChains } = useVaults();

  const {
    live: liveAuditCompetitions,
    upcoming: upcomingAuditCompetitions,
    finished: finishedAuditPayouts,
  } = useAuditCompetitionsVaults();

  const oldAudits = useOldAuditCompetitions();
  const allFinishedAuditCompetitions = [...finishedAuditPayouts, ...(oldAudits ?? [])];

  const draftAudits = useDraftAuditCompetitions();

  return (
    <>
      <Seo title={t("seo.auditCompetitionsTitle")} />
      <StyledVaultsPage className="content-wrapper-md">
        {!vaultsReadyAllChains && (
          <div className="vaults-container mt-4">
            <h2 className="subtitle">{t("liveCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <h2 className="subtitle mt-5">{t("upcomingCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <h2 className="subtitle mt-5">{t("finishedCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <VaultCardSkeleton className="mb-5 mt-5" />
            <VaultCardSkeleton className="mb-5 mt-5" />
          </div>
        )}

        {liveAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">{t("liveCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {liveAuditCompetitions.map((auditVault, idx) => (
                <VaultCard key={auditVault.id + idx} vaultData={auditVault} />
              ))}
            </div>
          </>
        )}

        {(upcomingAuditCompetitions.length > 0 || draftAudits.length > 0) && (
          <>
            <h2 className="subtitle">{t("upcomingCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {upcomingAuditCompetitions.map((auditVault, idx) => (
                <VaultCard key={auditVault.id + idx} vaultData={auditVault} />
              ))}
              {draftAudits.map((auditDraft, idx) => (
                <VaultAuditDraftCard key={auditDraft._id ?? "" + idx} vaultDraft={auditDraft} />
              ))}
            </div>
          </>
        )}

        {allFinishedAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">{t("finishedCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {allFinishedAuditCompetitions.map((auditPayout, idx) => (
                <VaultCard key={(auditPayout.id ?? 0) + idx} auditPayout={auditPayout} />
              ))}
            </div>
          </>
        )}
      </StyledVaultsPage>
    </>
  );
};
