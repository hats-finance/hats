import { Seo, VaultAuditDraftCard, VaultCard, VaultCardSkeleton } from "components";
import { useTranslation } from "react-i18next";
import { useAuditCompetitionsVaults, useDraftAuditCompetitions, useOldAuditCompetitions } from "./hooks";
import { StyledVaultsPage } from "./styles";

export const AuditVaultsPage = () => {
  const { t } = useTranslation();

  const {
    live: liveAuditCompetitions,
    upcoming: upcomingAuditCompetitions,
    finished: finishedAuditPayouts,
  } = useAuditCompetitionsVaults();

  const oldAudits = useOldAuditCompetitions();
  const allFinishedAuditCompetitions = [...finishedAuditPayouts, ...(oldAudits ?? [])];

  const draftAudits = useDraftAuditCompetitions();
  console.log(draftAudits);

  const areVaultsToShow =
    liveAuditCompetitions.length > 0 || upcomingAuditCompetitions.length > 0 || finishedAuditPayouts.length > 0;

  return (
    <>
      <Seo title={t("seo.auditCompetitionsTitle")} />
      <StyledVaultsPage className="content-wrapper-md">
        {!areVaultsToShow && (
          <div className="vaults-container mt-4">
            <h2 className="subtitle">{t("liveCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <h2 className="subtitle mt-5">{t("upcomingCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <h2 className="subtitle mt-5">{t("finishedCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <br />
            <VaultCardSkeleton className="mb-5" />
            <br />
            <VaultCardSkeleton className="mb-5" />
          </div>
        )}

        {liveAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">{t("liveCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {liveAuditCompetitions.map((auditVault) => (
                <VaultCard key={Math.random()} vaultData={auditVault} />
              ))}
            </div>
          </>
        )}

        {(upcomingAuditCompetitions.length > 0 || draftAudits.length > 0) && (
          <>
            <h2 className="subtitle">{t("upcomingCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {upcomingAuditCompetitions.map((auditVault) => (
                <VaultCard key={Math.random()} vaultData={auditVault} />
              ))}
              {draftAudits.map((auditDraft) => (
                <VaultAuditDraftCard key={Math.random()} vaultDraft={auditDraft} />
              ))}
            </div>
          </>
        )}

        {allFinishedAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">{t("finishedCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {allFinishedAuditCompetitions.map((auditPayout) => (
                <VaultCard key={Math.random()} auditPayout={auditPayout} />
              ))}
            </div>
          </>
        )}
      </StyledVaultsPage>
    </>
  );
};
