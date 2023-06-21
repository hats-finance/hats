import { IVault } from "@hats-finance/shared";
import { Button, Pill } from "components";
import millify from "millify";
import moment from "moment";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { VaultTokenIcon } from "../../components";
import { VaultDepositsSectionContext } from "../../store";
import { useVaultDepositWithdrawInfo } from "../../useVaultDepositWithdrawInfo";

type VaultHoldingsProps = {
  vault: IVault;
};

export const VaultHoldings = ({ vault }: VaultHoldingsProps) => {
  const { t } = useTranslation();

  const { handleWithdrawRequest } = useContext(VaultDepositsSectionContext);

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
        <Button size="medium" filledColor={isAudit ? "primary" : "secondary"}>
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

  return (
    <div className="row">
      <VaultTokenIcon vault={vault} />
      <div>{availableBalanceToWithdraw.formattedWithoutSymbol()}</div>
      <div>~${millify(availableBalanceToWithdraw.number * (vault.amountsInfo?.tokenPriceUsd ?? 0))}</div>
      <div className="status">{getStatusPill()}</div>
      <div className="action-button">{getActionButton()}</div>
    </div>
  );
};
