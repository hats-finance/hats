import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { t } from "i18next";
import { Colors } from "../../constants/constants";
import { RootState } from "../../reducers";
import { IPoolWithdrawRequest, IVault } from "../../types/types";
import { isProviderAndNetwork } from "../../utils";
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
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);
  const [isWithdrawable, setIsWithdrawable] = useState(false);
  const [isPendingWithdraw, setIsPendingWithdraw] = useState(false);
  const withdrawRequest = props.withdrawRequests?.filter((request: IPoolWithdrawRequest) => request.beneficiary === selectedAddress);

  // TODO: This is a temp fix to the issue when the countdown gets to minus value once it reaches 0.
  const [timerChanged, setTimerChanged] = useState(false);

  useEffect(() => {
    if (selectedAddress && withdrawRequest) {
      setIsWithdrawable(moment().isBetween(moment.unix(Number(withdrawRequest[0]?.withdrawEnableTime)), moment.unix(Number(withdrawRequest[0]?.expiryTime))));
      setIsPendingWithdraw(moment().isBefore(moment.unix(Number(withdrawRequest[0]?.withdrawEnableTime))));
    }
  }, [selectedAddress, withdrawRequest])

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
        disabled={props.preview || !isProviderAndNetwork(provider)}>
        {t("Vault.deposit-withdraw")}
      </button>
      {!props.preview && selectedAddress && isPendingWithdraw && !isWithdrawable && withdrawRequest &&
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
      {!props.preview && selectedAddress && isWithdrawable && !isPendingWithdraw && withdrawRequest &&
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
    </div>
  )
}
