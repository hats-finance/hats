import { Pill, VaultCard } from "components";
import { useTranslation } from "react-i18next";
import { useAuditCompetitionsVaults, useBugBountiesVaults } from "./hooks";
import { StyledVaultsPage } from "./styles";

export const BugBountyVaultsPage = () => {
  const { t } = useTranslation();

  const { live: liveAuditCompetitions } = useAuditCompetitionsVaults();
  const bugBounties = useBugBountiesVaults();

  return (
    <StyledVaultsPage className="content-wrapper-md">
      <h2 className="subtitle">
        {t("auditCompetitions")}
        <Pill color="blue" text={t("new")} transparent />
      </h2>

      <div className="vaults-container mt-4">
        {liveAuditCompetitions.map((auditVault, idx) => (
          <VaultCard key={auditVault.id + idx} vault={auditVault} />
        ))}
      </div>

      <h2 className="subtitle mt-5">{t("bugBounties")}</h2>

      <div className="vaults-container mt-4">
        {bugBounties.map((bountyVault, idx) => (
          <VaultCard key={bountyVault.id + idx} vault={bountyVault} />
        ))}
      </div>
    </StyledVaultsPage>
  );
};
