import { IVault } from "@hats-finance/shared";
import { Button, Loading, Modal, Pill } from "components";
import { WithdrawRequestContract } from "contracts";
import useModal from "hooks/useModal";
import millify from "millify";
import moment from "moment";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useWaitForTransaction } from "wagmi";
import { SuccessActionModal, VaultDepositWithdrawModal, VaultTokenIcon } from "../../components";
import { useVaultDepositWithdrawInfo } from "../../useVaultDepositWithdrawInfo";

type VaultHoldingsProps = {
  vault: IVault;
};

export const VaultHoldings = ({ vault }: VaultHoldingsProps) => {
  const { t } = useTranslation();
  const { isShowing: isShowingWithdrawModal, show: showWithdrawModal, hide: hideWithdrawModal } = useModal();
  const { isShowing: isShowingSuccessModal, show: showSuccessModal, hide: hideSuccessModal } = useModal();

  const isAudit = vault.description && vault.description["project-metadata"].type === "audit";

  const { availableBalanceToWithdraw, isUserInQueueToWithdraw, isUserInTimeToWithdraw, withdrawStartTime, withdrawEndTime } =
    useVaultDepositWithdrawInfo(vault);

  const getActionButton = () => {
    if (isUserInQueueToWithdraw) {
      return (
        <Button size="medium" filledColor="grey">
          {t("requestPending")}
        </Button>
      );
    } else if (isUserInTimeToWithdraw) {
      return (
        <Button size="medium" filledColor={isAudit ? "primary" : "secondary"} onClick={showWithdrawModal}>
          {t("withdraw")}
        </Button>
      );
    } else {
      return (
        <Button size="medium" filledColor={isAudit ? "primary" : "secondary"} onClick={handleWithdrawRequest}>
          {t("withdrawRequest")}
        </Button>
      );
    }
  };

  const getStatusPill = () => {
    if (isUserInQueueToWithdraw) {
      const date = moment((withdrawStartTime ?? 0) * 1000).format("MMM Mo");
      const time = new Date((withdrawStartTime ?? 0) * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "shortOffset",
      });
      return <Pill canMultiline dotColor="yellow" text={`${t("withdrawWindowWillOpenOn", { on: `${date} ${time}` })}`} />;
    } else if (isUserInTimeToWithdraw) {
      const date = moment((withdrawEndTime ?? 0) * 1000).format("MMM Mo");
      const time = new Date((withdrawEndTime ?? 0) * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "shortOffset",
      });
      return <Pill canMultiline dotColor="blue" text={`${t("withdrawWindowOpenUntil", { until: `${date} ${time}` })}`} />;
    } else {
      return "-";
    }
  };

  // -------> WITHDRAW REQUEST
  const withdrawRequestCall = WithdrawRequestContract.hook(vault);
  const waitingWithdrawRequestCall = useWaitForTransaction({
    hash: withdrawRequestCall.data?.hash as `0x${string}`,
    onSuccess: () => showSuccessModal(),
  });
  const handleWithdrawRequest = useCallback(() => {
    withdrawRequestCall.send();
  }, [withdrawRequestCall]);

  return (
    <>
      <div className="row">
        <VaultTokenIcon vault={vault} />
        <div>{availableBalanceToWithdraw.formattedWithoutSymbol()}</div>
        <div>~${millify(availableBalanceToWithdraw.number * (vault.amountsInfo?.tokenPriceUsd ?? 0))}</div>
        <div className="status">{getStatusPill()}</div>
        <div className="action-button">{getActionButton()}</div>
      </div>

      <Modal
        title={t("withdrawToken", { token: vault.stakingTokenSymbol })}
        isShowing={isShowingWithdrawModal}
        onHide={hideWithdrawModal}
      >
        <VaultDepositWithdrawModal action="WITHDRAW" vault={vault} closeModal={hideWithdrawModal} />
      </Modal>

      {withdrawRequestCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}
      {waitingWithdrawRequestCall.isLoading && <Loading fixed extraText={`${t("requestingWithdraw")}...`} />}

      <Modal
        isShowing={isShowingSuccessModal}
        onHide={() => {
          hideWithdrawModal();
          hideSuccessModal();
        }}
      >
        <SuccessActionModal
          title={t("successWithdrawRequestModalTitle")}
          content={t("successWithdrawRequestModalContent")}
          closeModal={hideSuccessModal}
        />
      </Modal>
    </>
  );
};
