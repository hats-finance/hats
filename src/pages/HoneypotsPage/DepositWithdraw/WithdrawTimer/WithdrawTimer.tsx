import { Countdown } from "components";
import { Colors } from "constants/constants";
import { useVaultDepositWithdrawInfo } from "../hooks";
import { IVault } from "types/types";

interface IProps {
  vault: IVault;
  plainTextView?: boolean;
  placeHolder?: string;
  showWithdrawState?: boolean;
}

export function WithdrawTimer({ vault, plainTextView, placeHolder, showWithdrawState = true }: IProps) {
  const { isUserInQueueToWithdraw, isUserInTimeToWithdraw, withdrawStartTime, withdrawEndTime } =
    useVaultDepositWithdrawInfo(vault);

  // const withdrawRequestTime = useWithdrawRequestStartTime(vault)?.toNumber();
  // const nowInSeconds = Date.now() / 1000;
  // const pendingWithdraw = nowInSeconds < (withdrawRequestTime ?? 0);
  // const withdrawRequestEnablePeriod = Number(vault.master.withdrawRequestEnablePeriod) * 1000;
  // const endDateInEpoch = withdrawRequestTime ? withdrawRequestTime + withdrawRequestEnablePeriod : null;
  // const isWithdrawable = withdrawRequestTime && endDateInEpoch ? nowInSeconds > withdrawRequestTime && nowInSeconds < endDateInEpoch : false;
  const countdownValue = isUserInTimeToWithdraw ? withdrawEndTime : withdrawStartTime;

  console.log("withdrawStartTime", withdrawStartTime);
  console.log("withdrawEndTime", withdrawEndTime);
  console.log("countdownValue", countdownValue);

  return (
    <>
      {(isUserInQueueToWithdraw || isUserInTimeToWithdraw) && countdownValue ? (
        <>
          {showWithdrawState && <span>{isUserInQueueToWithdraw ? "Pending" : "Withdrawable"} </span>}
          <Countdown
            plainTextView={plainTextView}
            endDate={countdownValue}
            textColor={isUserInQueueToWithdraw ? Colors.yellow : Colors.turquoise}
          />
        </>
      ) : (
        placeHolder
      )}
    </>
  );
}
