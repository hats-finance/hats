import { useEthers } from "@usedapp/core";
import { Countdown } from "components";
import { Colors } from "constants/constants";
import { useWithdrawRequestInfo } from "hooks/contractHooksCalls";
import { IVault } from "types/types";

interface IProps {
  vault: IVault;
  plainTextView?: boolean;
  placeHolder?: string;
  showWithdrawState?: boolean;
}

export function WithdrawTimer({ vault, plainTextView, placeHolder, showWithdrawState = true }: IProps) {
  const { account } = useEthers();
  const withdrawRequestTime = useWithdrawRequestInfo(vault.master.address, vault, account!)?.toNumber();
  const now = Date.now();
  const pendingWithdraw = now < (withdrawRequestTime ?? 0);
  const withdrawRequestEnablePeriod = Number(vault.master.withdrawRequestEnablePeriod) * 1000;
  const endDateInEpoch = withdrawRequestTime ? withdrawRequestTime + withdrawRequestEnablePeriod : null;
  const isWithdrawable = withdrawRequestTime && endDateInEpoch ? now > withdrawRequestTime &&
    now < endDateInEpoch : false;
  const countdownValue = isWithdrawable && endDateInEpoch ? endDateInEpoch : withdrawRequestTime;

  return (
    <>
      {(pendingWithdraw || isWithdrawable) && countdownValue ? (
        <>
          {showWithdrawState && <span>{pendingWithdraw ? "Pending" : "Withdrawable"} </span>}
          <Countdown
            plainTextView={plainTextView}
            endDate={countdownValue}
            textColor={pendingWithdraw ? Colors.yellow : Colors.turquoise}
          />
        </>
      ) : (
        placeHolder
      )}
    </>
  );
}
