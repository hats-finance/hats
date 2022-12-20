import { CountdownTimer } from "components";
import { IVault } from "types";
import { getVaultWithdrawTime } from "../useVaultDepositWithdrawInfo";

interface IProps {
  vault: IVault;
  plainTextView?: boolean;
  placeHolder?: string;
  showWithdrawState?: boolean;
}

export function WithdrawTimer({ vault, plainTextView, placeHolder, showWithdrawState = true }: IProps) {
  const { isUserInQueueToWithdraw, isUserInTimeToWithdraw, withdrawStartTime, withdrawEndTime } = getVaultWithdrawTime(vault);

  const countdownValue = isUserInQueueToWithdraw ? withdrawStartTime : withdrawEndTime;

  return (
    <>
      {(isUserInQueueToWithdraw || isUserInTimeToWithdraw) && countdownValue ? (
        <>
          {showWithdrawState && <span>{isUserInQueueToWithdraw ? "Pending" : "Withdrawable"} </span>}
          <CountdownTimer
            plainTextView={plainTextView}
            endDate={countdownValue * 1000}
            color={isUserInQueueToWithdraw ? "yellow" : "blue"}
          />
        </>
      ) : (
        placeHolder
      )}
    </>
  );
}
