import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BigNumber } from "ethers";
import millify from "millify";
import { Alert, Button, Modal, Pill } from "components";
import { ipfsTransformUri } from "utils";
import { useVaults } from "hooks/vaults/useVaults";
import useModal from "hooks/useModal";
import { DepositWithdraw } from "pages/HoneypotsPage/DepositWithdraw";
import { getTokenInfo } from "utils/tokens.utils";
import { Amount } from "utils/amounts.utils";
import { VaultStatusContext } from "../store";
import SyncIcon from "@mui/icons-material/Sync";

export const DepositStatusCard = () => {
  const { t } = useTranslation();
  const [tokenInfo, setTokenInfo] = useState<{ isValidToken: boolean; name: string; symbol: string }>();

  const { vaultData, vaultAddress, vaultChainId, refreshVaultData } = useContext(VaultStatusContext);
  const { isShowing: isShowingDepositModal, show: showDepositModal, hide: hideDepositModal } = useModal();

  const { vaults } = useVaults();
  const selectedVault = vaultAddress ? vaults?.find((v) => v.id.toLowerCase() === vaultAddress.toLowerCase()) : undefined;

  const vaultBalance = new Amount(BigNumber.from(vaultData.depositedAmount), vaultData.tokenDecimals).number;
  const isVaultDeposited = vaultData.depositedAmount.gt(0);

  const getAssetInformation = async () => {
    const info = await getTokenInfo(vaultData.assetToken, vaultChainId);
    setTokenInfo(info);
  };

  useEffect(() => {
    getAssetInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultData]);

  return (
    <>
      <div className="status-card">
        <div className="status-card__title">
          <div className="leftSide">
            <span>{t("deposit")}</span>
            <Pill
              color={isVaultDeposited ? "blue" : "red"}
              text={
                isVaultDeposited ? t("completed") : vaultData.isCommitteeCheckedIn ? t("awaitingAction") : t("awaitingCheckin")
              }
            />
          </div>
          <div className="reload" onClick={refreshVaultData}>
            <SyncIcon />
          </div>
        </div>
        {isVaultDeposited && (
          <div className="status-card__deposited">
            <div className="field">
              <p className="title">{t("depositedAsset")}</p>
              <div className="value">
                <img src={ipfsTransformUri(selectedVault?.description?.["project-metadata"].tokenIcon)} alt={tokenInfo?.name} />
                <p>
                  {tokenInfo?.name} ({tokenInfo?.symbol})
                </p>
              </div>
            </div>
            <div className="field">
              <p className="title">{t("amount")}</p>
              <div className="value">
                <p>{millify(vaultBalance)}</p>
              </div>
            </div>
          </div>
        )}
        {vaultData.isCommitteeCheckedIn && !isVaultDeposited && (
          <p className="status-card__text mb-5">{t("depositOnVaultExplanation")}</p>
        )}
        {!vaultData.isCommitteeCheckedIn && <Alert content={t("committeeMustCheckInFirst")} type="warning" />}
        <Button className="status-card__button" disabled={!vaultData.isCommitteeCheckedIn} onClick={showDepositModal}>
          {t("deposit")}
        </Button>
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
