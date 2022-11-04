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

  const countdownValue = isUserInQueueToWithdraw ? withdrawStartTime : withdrawEndTime;

  return (
    <>
      {(isUserInQueueToWithdraw || isUserInTimeToWithdraw) && countdownValue ? (
        <>
          {showWithdrawState && <span>{isUserInQueueToWithdraw ? "Pending" : "Withdrawable"} </span>}
          <Countdown
            plainTextView={plainTextView}
            endDate={countdownValue * 1000}
            textColor={isUserInQueueToWithdraw ? Colors.yellow : Colors.turquoise}
          />
        </>
      ) : (
        placeHolder
      )}
    </>
  );
}
