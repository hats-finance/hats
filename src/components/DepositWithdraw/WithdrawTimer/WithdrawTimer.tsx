import { useEthers } from "@usedapp/core";
import Countdown from "components/Shared/Countdown/Countdown";
import { Colors } from "constants/constants";
import { useWithdrawRequestInfo } from "hooks/contractHooks";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { IVault } from "types/types";
import { isDateBefore, isDateBetween } from "utils";

interface IProps {
  vault: IVault;
  plainTextView?: boolean;
  placeHolder?: string;
  showWithdrawState?: boolean;
}

export default function WithdrawTimer({ vault, plainTextView, placeHolder, showWithdrawState = true }: IProps) {
  const { t } = useTranslation();
  const { account } = useEthers();
  const withdrawRequestTime = useWithdrawRequestInfo(vault.master.address, vault.pid, account!);
  const pendingWithdraw = isDateBefore(withdrawRequestTime?.toString());
  const endDateInEpoch = moment.unix(withdrawRequestTime?.toNumber() ?? 0).add(vault.master.withdrawRequestEnablePeriod.toString(), "seconds").unix();
  const isWithdrawable = isDateBetween(withdrawRequestTime?.toString(), endDateInEpoch);
  const countdownValue = isWithdrawable ? endDateInEpoch.toString() : withdrawRequestTime?.toString();

  return (
    <>
      {(pendingWithdraw || isWithdrawable) && countdownValue ? (
        <>
          {showWithdrawState && <span>{pendingWithdraw ? t("DepositWithdraw.WithdrawTimer.pending") : t("DepositWithdraw.WithdrawTimer.withdrawable")}</span>}
          <Countdown
            plainTextView={plainTextView}
            endDate={countdownValue}
            textColor={pendingWithdraw ? Colors.yellow : Colors.turquoise} />
        </>
      ) : placeHolder}
    </>
  )
}
