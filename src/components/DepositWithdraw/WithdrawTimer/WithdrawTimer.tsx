import Countdown from "components/Shared/Countdown/Countdown";
import "./index.scss";

interface IProps {
  expiryTime: string
  setIsWithdrawable: Function
}

export const WithdrawTimer = (props: IProps) => {
  return (
    <div className="withdraw-timer-wrapper">
      <span>WITHDRAWAL AVAILABLE FOR:</span>
      <Countdown
        endDate={props.expiryTime}
        compactView={true}
        onEnd={() => {
          props.setIsWithdrawable(false);
        }} />
    </div>
  )
}
