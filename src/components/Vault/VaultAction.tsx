import { useEthers } from "@usedapp/core";
import moment from "moment";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { Colors } from "../../constants/constants";
import { IPoolWithdrawRequest, IVault } from "../../types/types";
import Countdown from "../Shared/Countdown/Countdown";
import "./VaultAction.scss";

interface IProps {
  data?: IVault
  withdrawRequests?: IPoolWithdrawRequest[]
  setShowModal?: Function
  setModalData?: Function
  preview?: boolean
}

export default function VaultAction(props: IProps) {
  const { account } = useEthers();
  const [isWithdrawable, setIsWithdrawable] = useState(false);
  const [isPendingWithdraw, setIsPendingWithdraw] = useState(false);
  const withdrawRequest = props.withdrawRequests?.filter((request: IPoolWithdrawRequest) => request.beneficiary === account);

  // TODO: This is a temp fix to the issue when the countdown gets to minus value once it reaches 0.
  const [timerChanged, setTimerChanged] = useState(false);

  useEffect(() => {
    if (account && withdrawRequest) {
      setIsWithdrawable(moment().isBetween(moment.unix(Number(withdrawRequest[0]?.withdrawEnableTime)), moment.unix(Number(withdrawRequest[0]?.expiryTime))));
      setIsPendingWithdraw(moment().isBefore(moment.unix(Number(withdrawRequest[0]?.withdrawEnableTime))));
    }
  }, [account, withdrawRequest])

  return (
    <div className="vault-action-wrapper">
      <button
        className="deposit-withdraw"
        onClick={() => {
          if (props.setShowModal && props.setModalData) {
            props.setShowModal(true);
            props.setModalData(props.data);
          }
        }}
        disabled={props.preview || !account}>
        {t("Vault.deposit-withdraw")}
      </button>
      {/* TODO: Need to fetch withdrawRequests in useVaults and handle it globally from there */}
      {!props.preview && account && isPendingWithdraw && !isWithdrawable && withdrawRequest &&
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
          <span>{t("Vault.withdrawal-request-pending")}</span>
        </>
      }
      {
        !props.preview && account && isWithdrawable && !isPendingWithdraw && withdrawRequest &&
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
          <span>{t("Vault.withdrawal-available")}</span>
        </>
      }
    </div >
  )
}
