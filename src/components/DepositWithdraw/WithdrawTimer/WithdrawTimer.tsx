import { useEthers } from "@usedapp/core";
import Countdown from "components/Shared/Countdown/Countdown";
import { Colors } from "constants/constants";
import { useGeneralParameters, useWithdrawRequestInfo } from "hooks/contractHooks";
import moment from "moment";
import { IVault } from "types/types";
import { isDateBefore, isDateBetween } from "utils";

interface IProps {
  vault: IVault;
}

export default function WithdrawTimer({ vault }: IProps) {
  const { account } = useEthers();
  const generalParams = useGeneralParameters(vault.master.address);
  const withdrawRequestTime = useWithdrawRequestInfo(vault.master.address, vault.pid, account!);
  const pendingWithdraw = isDateBefore(withdrawRequestTime?.toString());
  const endDateInEpoch = moment.unix(withdrawRequestTime?.toNumber() ?? 0).add(generalParams?.withdrawRequestEnablePeriod.toString(), "seconds").unix();
  const isWithdrawable = isDateBetween(withdrawRequestTime?.toString(), endDateInEpoch);
  const countdownValue = isWithdrawable ? endDateInEpoch.toString() : withdrawRequestTime?.toString();

  return (
    <>
      {(pendingWithdraw || isWithdrawable) ? (
        <>
          <span>{pendingWithdraw ? "Pending " : "Withdrawable "}</span>
          <Countdown
            plainTextView
            endDate={countdownValue}
            textColor={pendingWithdraw ? Colors.yellow : Colors.turquoise} />
        </>
      ) : "-"}
    </>
  )
}
