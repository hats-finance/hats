import OpenIcon from "@mui/icons-material/ViewComfyOutlined";
import { Button, Modal, Pill } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useModal from "hooks/useModal";
import { VaultDetailsPage } from "pages/Honeypots/VaultDetailsPage/VaultDetailsPage";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { VaultStatusContext } from "../store";
import { StyledPreviewModal } from "../styles";

export const GovApprovalStatusCard = () => {
  const { t } = useTranslation();

  const { isShowing: isShowingPreview, show: showPreview, hide: hidePreview } = useModal();

  const { vaultData, vaultAddress } = useContext(VaultStatusContext);
  const { allVaults } = useVaults();
  const vault = allVaults?.find((vault) => vault.id === vaultAddress);

  const isApprovedByGov = vaultData.isRegistered;

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
        <>
          <Button className="mt-5" onClick={showPreview}>
            {t("showVaultPreview")} <OpenIcon className="ml-3" />
          </Button>
          <Modal isShowing={isShowingPreview} onHide={hidePreview}>
            <StyledPreviewModal>
              <VaultDetailsPage vaultToUse={vault} noActions />
            </StyledPreviewModal>
          </Modal>
        </>
      )}
    </div>
  );
};
