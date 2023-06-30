import { Seo, VaultCard } from "components";
import { useTranslation } from "react-i18next";
import { useAuditCompetitionsVaults, useOldAuditCompetitions } from "./hooks";
import { StyledVaultsPage } from "./styles";

export const AuditVaultsPage = () => {
  const { t } = useTranslation();

  const {
    live: liveAuditCompetitions,
    upcoming: upcomingAuditCompetitions,
    finished: finishedAuditPayouts,
  } = useAuditCompetitionsVaults();

  const oldAudits = useOldAuditCompetitions();

  return (
    <>
      <Seo title={t("seo.auditCompetitionsTitle")} />
      <StyledVaultsPage className="content-wrapper-md">
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

        {upcomingAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">{t("upcomingCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {upcomingAuditCompetitions.map((auditVault, idx) => (
                <VaultCard key={auditVault.id + idx} vaultData={auditVault} />
              ))}
            </div>
          </>
        )}

        {[...finishedAuditPayouts, ...(oldAudits ?? [])].length > 0 && (
          <>
            <h2 className="subtitle">{t("finishedCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {[...finishedAuditPayouts, ...(oldAudits ?? [])].map((auditPayout, idx) => (
                <VaultCard key={auditPayout.id + idx} auditPayout={auditPayout} />
              ))}
            </div>
          </>
        )}
      </StyledVaultsPage>
    </>
  );
};
