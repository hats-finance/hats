import { IVault } from "@hats-finance/shared";
import { Button, Modal } from "components";
import useModal from "hooks/useModal";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { VaultDepositWithdrawModal, VaultTokenIcon } from "../../components";

type VaultAssetProps = {
  vault: IVault;
};

export const VaultAsset = ({ vault }: VaultAssetProps) => {
  const { t } = useTranslation();
  const { isShowing: isShowingDepositModal, show: showDepositModal, hide: hideDepositModal } = useModal();

  const isAudit = vault.description && vault.description["project-metadata"].type === "audit";
  const depositsDisabled = !vault.committeeCheckedIn || vault.depositPause;

  return (
    <>
      <div className="row">
        <VaultTokenIcon vault={vault} />
        <div>
          {millify(vault.amountsInfo?.depositedAmount.tokens ?? 0)} {vault.stakingTokenSymbol}
        </div>
        <div>~${millify(vault.amountsInfo?.depositedAmount.usd ?? 0)}</div>
        <div className="action-button">
          <Button
            disabled={depositsDisabled}
            size="medium"
            filledColor={isAudit ? "primary" : "secondary"}
            onClick={!depositsDisabled ? showDepositModal : undefined}
          >
            {t("deposit")}
          </Button>
        </div>
      </div>

      {!depositsDisabled && (
        <Modal
          title={t("depositToken", { token: vault.stakingTokenSymbol })}
          isShowing={isShowingDepositModal}
          onHide={hideDepositModal}
        >
          {isShowingDepositModal ? (
            <VaultDepositWithdrawModal action="DEPOSIT" vault={vault} closeModal={hideDepositModal} />
          ) : (
            <></>
          )}
        </Modal>
      )}
    </>
  );
};
