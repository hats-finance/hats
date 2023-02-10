import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, Pill } from "components";
import { ipfsTransformUri } from "utils";
import { useVaults } from "hooks/vaults/useVaults";
import useModal from "hooks/useModal";
import { DepositWithdraw } from "pages/HoneypotsPage/DepositWithdraw";
import { VaultStatusContext } from "../store";

export const DepositStatusCard = () => {
  const { t } = useTranslation();

  const { vaultData, vaultAddress } = useContext(VaultStatusContext);
  const { isShowing: isShowingDepositModal, show: showDepositModal, hide: hideDepositModal } = useModal();

  const { vaults } = useVaults();
  const selectedVault = vaultAddress ? vaults?.find((v) => v.id.toLowerCase() === vaultAddress.toLowerCase()) : undefined;

  const isVaultDeposited = vaultData.depositedAmount.gt(0);

  return (
    <>
      <div className="status-card">
        <div className="status-card__title">
          <div className="leftSide">
            <span>{t("deposit")}</span>
            <Pill color={isVaultDeposited ? "blue" : "red"} text={isVaultDeposited ? t("completed") : t("awaitingAction")} />
          </div>
        </div>

        {isVaultDeposited ? (
          <p className="status-card__text">Assets deposited:</p>
        ) : (
          <>
            {vaultData.isCommitteeCheckedIn ? (
              <>
                <p className="status-card__text">{t("depositOnVaultExplanation")}</p>
                <Button className="status-card__button" onClick={showDepositModal}>
                  {t("deposit")}
                </Button>
              </>
            ) : (
              <>
                <p className="status-card__text">{t("depositOnVaultExplanation")}</p>
                <p className="status-card__error">{t("committeeMustCheckInFirst")}</p>
                <Button disabled className="status-card__button">
                  {t("deposit")}
                </Button>
              </>
            )}
          </>
        )}
      </div>
      {selectedVault && (
        <Modal
          isShowing={isShowingDepositModal}
          title={`${selectedVault.description?.["project-metadata"].name!} ${selectedVault.version === "v2" ? "(v2)" : ""}`}
          titleIcon={ipfsTransformUri(selectedVault.description?.["project-metadata"].icon!)}
          onHide={hideDepositModal}
          removeHorizontalPadding
        >
          <DepositWithdraw vault={selectedVault} closeModal={hideDepositModal} />
        </Modal>
      )}
    </>
  );
};
