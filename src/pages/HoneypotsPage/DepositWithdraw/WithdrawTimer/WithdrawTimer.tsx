import { CountdownTimer } from "components";
import { useVaultWithdrawTime } from "../hooks";
import { IVault } from "types/types";

interface IProps {
  vault: IVault;
  plainTextView?: boolean;
  placeHolder?: string;
  showWithdrawState?: boolean;
}

export function WithdrawTimer({ vault, plainTextView, placeHolder, showWithdrawState = true }: IProps) {
  const { isUserInQueueToWithdraw, isUserInTimeToWithdraw, withdrawStartTime, withdrawEndTime } = useVaultWithdrawTime(vault);

  const countdownValue = isUserInQueueToWithdraw ? withdrawStartTime : withdrawEndTime;

  console.log(vault.id, (isUserInQueueToWithdraw || isUserInTimeToWithdraw) && countdownValue);

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
