import moment from "moment";
import humanizeDuration from "humanize-duration";
import Countdown from "components/Shared/Countdown/Countdown";
import { Colors } from "constants/constants";
import "./index.scss";

interface IProps {
  withdrawEnableTime: string
  expiryTime: string
  setIsPendingWithdraw: Function
  setIsWithdrawable: Function
}

export const PendingWithdraw = (props: IProps) => {
  const { withdrawEnableTime, expiryTime, setIsPendingWithdraw, setIsWithdrawable } = props;
  const diff = moment.unix(Number(expiryTime)).diff(moment.unix(Number(withdrawEnableTime)), "milliseconds");
  return (
    <div className="pending-withdraw-timer-wrapper">
      <span>
        WITHDRAWAL REQUEST HASE BEEN SENT.<br /><br />
        YOU WILL BE ABLE TO MAKE A WITHDRAWAL FOR <span>{humanizeDuration(Number(diff), { units: ["d", "h", "m"] })} PERIOD</span><br /><br />
        WITHDRAWAL AVAILABLE WITHIN:
      </span>
      <Countdown
        endDate={withdrawEnableTime}
        onEnd={() => {
          setIsPendingWithdraw(false);
          setIsWithdrawable(true);
        }}
        textColor={Colors.yellow} />
    </div>
  )
}
