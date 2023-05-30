import { VaultCard } from "components";
import { useTranslation } from "react-i18next";
import { useAuditCompetitionsVaults } from "./hooks";
import { StyledVaultsPage } from "./styles";

export const AuditVaultsPage = () => {
  const { t } = useTranslation();

  const {
    live: liveAuditCompetitions,
    upcoming: upcomingAuditCompetitions,
    finished: finishedAuditCompetitions,
  } = useAuditCompetitionsVaults();

  return (
    <StyledVaultsPage className="content-wrapper-md">
      {liveAuditCompetitions.length > 0 && (
        <>
          <h2 className="subtitle">{t("liveCompetitions")}</h2>
          <div className="vaults-container mt-4">
            {liveAuditCompetitions.map((auditVault, idx) => (
              <VaultCard key={auditVault.id + idx} vault={auditVault} />
            ))}
          </div>
        </>
      )}

      {upcomingAuditCompetitions.length > 0 && (
        <>
          <h2 className="subtitle">{t("upcomingCompetitions")}</h2>
          <div className="vaults-container mt-4">
            {upcomingAuditCompetitions.map((auditVault, idx) => (
              <VaultCard key={auditVault.id + idx} vault={auditVault} />
            ))}
          </div>
        </>
      )}

      {finishedAuditCompetitions.length > 0 && (
        <>
          <h2 className="subtitle">{t("finishedCompetitions")}</h2>
          <div className="vaults-container mt-4">
            {finishedAuditCompetitions.map((auditVault, idx) => (
              <VaultCard key={auditVault.id + idx} vault={auditVault} />
            ))}
          </div>
        </>
      )}
    </StyledVaultsPage>
  );
};
