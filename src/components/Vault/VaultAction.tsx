import { useEthers } from "@usedapp/core";
import moment from "moment";
import { useEffect, useState } from "react";
import { Colors } from "../../constants/constants";
import { IPoolWithdrawRequest, IVault } from "../../types/types";
import Countdown from "../Shared/Countdown/Countdown";
import "./VaultAction.scss";

interface IProps {
  data: IVault
  withdrawRequests: IPoolWithdrawRequest[]
  setShowModal: Function
  setModalData: Function
}

export default function VaultAction(props: IProps) {
  const { account } = useEthers()
  const [isWithdrawable, setIsWithdrawable] = useState(false);
  const [isPendingWithdraw, setIsPendingWithdraw] = useState(false);
  const withdrawRequest = props.withdrawRequests.filter((request: IPoolWithdrawRequest) => request.beneficiary === account);

  // TODO: This is a temp fix to the issue when the countdown gets to minus value once it reaches 0.
  const [timerChanged, setTimerChanged] = useState(false);

  useEffect(() => {
    if (account) {
      setIsWithdrawable(moment().isBetween(moment.unix(Number(withdrawRequest[0]?.withdrawEnableTime)), moment.unix(Number(withdrawRequest[0]?.expiryTime))));
      setIsPendingWithdraw(moment().isBefore(moment.unix(Number(withdrawRequest[0]?.withdrawEnableTime))));
    }
  }, [account, withdrawRequest])

  return (
    <div className="vault-action-wrapper">
      <button
        className="deposit-withdraw"
        onClick={() => { props.setShowModal(true); props.setModalData(props.data); }}
        disabled={!account}>
        DEPOSIT / WITHDRAW
      </button>
      {account && isPendingWithdraw && !isWithdrawable &&
        <>
          <div className="countdown-wrapper">
            <Countdown
              endDate={withdrawRequest[0]?.withdrawEnableTime}
              compactView
              onEnd={() => {
                setTimerChanged(!timerChanged);
                setIsPendingWithdraw(false);
                setIsWithdrawable(true);
              }}
              textColor={Colors.yellow} />
          </div>
          <span>WITHDRAWAL REQUEST PENDING</span>
        </>
      }
      {account && isWithdrawable && !isPendingWithdraw &&
        <>
          <div className="countdown-wrapper">
            <Countdown
              endDate={withdrawRequest[0]?.expiryTime}
              compactView
              onEnd={() => {
                setTimerChanged(!timerChanged);
                setIsWithdrawable(false);
              }}
            />
          </div>
          <span>WITHDRAWAL AVAILABLE</span>
        </>
      }
    </div>
  )
}
