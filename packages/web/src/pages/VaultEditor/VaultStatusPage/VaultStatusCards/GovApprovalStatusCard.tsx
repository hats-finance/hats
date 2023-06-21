import ArrowIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Button, Pill } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { RoutePaths } from "navigation";
import { HoneypotsRoutePaths } from "pages/Honeypots/router";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { slugify } from "utils/slug.utils";
import { VaultStatusContext } from "../store";

export const GovApprovalStatusCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { vaultData, vaultAddress } = useContext(VaultStatusContext);
  const { allVaults } = useVaults();
  const vault = allVaults?.find((vault) => vault.id === vaultAddress);

  const isApprovedByGov = vaultData.isRegistered;
  const isAudit = vault && vault.description && vault.description["project-metadata"].type === "audit";

  const goToDetails = () => {
    if (!vault) return;

    const mainRoute = `${RoutePaths.vaults}/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`;
    const vaultSlug = slugify(vault?.description?.["project-metadata"].name ?? "");

    navigate(`${mainRoute}/${vaultSlug}-${vault.id}`);
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <h3>{t("govApproval")}</h3>
          <Pill dotColor={isApprovedByGov ? "blue" : "red"} text={isApprovedByGov ? t("live") : t("pendingApproval")} />
        </div>
      </div>

      {isApprovedByGov ? (
        <p className="status-card__text">{t("vautlLiveExplanation")}</p>
      ) : (
        <>
          <p className="status-card__text">{t("pendingApprovalExplanation")}</p>
          {/* <Button className="status-card__button">{t("checkIn")}</Button> */}
        </>
      )}

      {vault && (
        <Button className="mt-5" onClick={goToDetails}>
          {t("goToVaultDetailsPage")} <ArrowIcon className="ml-3" />
        </Button>
      )}
    </div>
  );
};
