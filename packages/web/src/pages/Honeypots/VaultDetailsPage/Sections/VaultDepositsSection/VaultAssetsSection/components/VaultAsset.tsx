import { IVault } from "@hats.finance/shared";
import { ReactComponent as HatsTokenIcon } from "assets/icons/hat-token.svg";
import { Button, Modal } from "components";
import useModal from "hooks/useModal";
import { useVaultApy } from "hooks/vaults/useVaultApy";
import millify from "millify";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { VaultDepositWithdrawModal, VaultTokenIcon } from "../../components";

type VaultAssetProps = {
  vault: IVault;
};

export const VaultAsset = ({ vault }: VaultAssetProps) => {
  const { t } = useTranslation();
  const { isShowing: isShowingDepositModal, show: showDepositModal, hide: hideDepositModal } = useModal();

  const vaultApy = useVaultApy(vault);
  console.log(vaultApy);

  const isAudit = vault.description && vault.description["project-metadata"].type === "audit";
  const depositsDisabled = !vault.committeeCheckedIn || vault.depositPause;

  return (
    <>
      <div className="row">
        <VaultTokenIcon vault={vault} />
        <div>
          {vault.amountsInfo?.depositedAmount.tokens ?? 0}
          {vault.stakingTokenSymbol}
        </div>
        <div>~${millify(vault.amountsInfo?.depositedAmount.usd ?? 0)}</div>
        {vaultApy.map((apyData, index) => (
          <Fragment key={index}>
            <div className="token-reward-info">
              <div className="logo">{apyData.rewardController.rewardTokenSymbol === "HAT" && <HatsTokenIcon />}</div>
              <div>{apyData.rewardController.rewardTokenSymbol}</div>
            </div>
            <div>{millify(apyData.apy)}%</div>
          </Fragment>
        ))}
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
          <VaultDepositWithdrawModal action="DEPOSIT" vault={vault} closeModal={hideDepositModal} />
        </Modal>
      )}
    </>
  );
};
