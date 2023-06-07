import { Pill, Seo, VaultCard } from "components";
import { useTranslation } from "react-i18next";
import { useAuditCompetitionsVaults, useBugBountiesVaults } from "./hooks";
import { StyledVaultsPage } from "./styles";

export const BugBountyVaultsPage = () => {
  const { t } = useTranslation();

  const { live: liveAuditCompetitions, upcoming: upcomingAuditCompetitions } = useAuditCompetitionsVaults();
  const bugBounties = useBugBountiesVaults();

  return (
    <>
      <Seo title={t("seo.bugBountiesTitle")} />
      <StyledVaultsPage className="content-wrapper-md">
        {[...liveAuditCompetitions, ...upcomingAuditCompetitions].length > 0 && (
          <>
            <h2 className="subtitle">
              {t("auditCompetitions")}
              <Pill color="blue" text={t("new")} transparent />
            </h2>
            <div className="vaults-container mt-4">
              {(liveAuditCompetitions.length > 0 ? liveAuditCompetitions : upcomingAuditCompetitions).map((auditVault, idx) => (
                <VaultCard key={auditVault.id + idx} vaultData={auditVault} />
              ))}
            </div>
          </>
        )}

        <h2 className="subtitle mt-5">{t("bugBounties")}</h2>
        <div className="vaults-container mt-4">
          {bugBounties.map((bountyVault, idx) => (
            <VaultCard key={bountyVault.id + idx} vaultData={bountyVault} />
          ))}
        </div>
      </StyledVaultsPage>
    </>
  );
};
