import { Loading, VaultCard } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { RoutePaths } from "navigation";
import { useTranslation } from "react-i18next";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { HoneypotsRoutePaths } from "../router";
import { StyledVaultDetailsPage } from "./styles";

export const VaultDetailsPage = () => {
  const { t } = useTranslation();

  const { allVaults } = useVaults();
  const navigate = useNavigate();
  const { vaultSlug } = useParams();
  const vaultId = vaultSlug?.split("-").pop();
  const vault = allVaults?.find((vault) => vault.id === vaultId);

  if (allVaults?.length === 0) return <Loading extraText={`${t("loadingVaultDetails")}...`} />;
  if (!vault || !vault.description) {
    redirect("/");
    return null;
  }

  const isAudit = vault.description["project-metadata"].type === "audit";
  const vaultLogo = vault.description["project-metadata"].icon;
  const vaultName = vault.description["project-metadata"].name;

  const navigateToType = () => {
    navigate(`${RoutePaths.vaults}/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`);
  };

  return (
    <StyledVaultDetailsPage className="content-wrapper" isAudit={isAudit}>
      <div className="breadcrumb">
        <span className="type" onClick={navigateToType}>
          {isAudit ? t("auditCompetitions") : t("bugBounties")}/
        </span>
        <span className="name">{vaultName}</span>
      </div>

      <div className="vaultCard">
        <VaultCard reducedStyles vaultData={vault} />
      </div>
    </StyledVaultDetailsPage>
  );
};
