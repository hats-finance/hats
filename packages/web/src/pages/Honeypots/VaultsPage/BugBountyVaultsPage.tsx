import { Pill, VaultCard } from "components";
import { useTranslation } from "react-i18next";
import { useAuditCompetitionsVaults, useBugBountiesVaults } from "./hooks";
import { StyledVaultsPage } from "./styles";

export const BugBountyVaultsPage = () => {
  const { t } = useTranslation();

  const { live: liveAuditCompetitions } = useAuditCompetitionsVaults();
  const bugBounties = useBugBountiesVaults();
  console.log("bugBounties", bugBounties);
  console.log("liveAuditCompetitions", liveAuditCompetitions);

  return (
    <StyledVaultsPage className="content-wrapper-md">
      <h2 className="subtitle">
        {t("auditCompetitions")}
        <Pill color="blue" text={t("new")} transparent />
      </h2>

      <div className="vaults-container">
        {/* {bugBounties.map((vault) => (
          <VaultCard vault={vault} />
        ))} */}
      </div>

      <h2 className="subtitle mt-5">{t("bugBounties")}</h2>

      <div className="vaults-container mt-3">
        {bugBounties.map((vault) => (
          <VaultCard vault={vault} />
        ))}
      </div>
    </StyledVaultsPage>
  );
};
