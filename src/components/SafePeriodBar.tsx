import { useSelector } from "react-redux";
import { IWithdrawSafetyPeriod } from "../types/types";
import moment from "moment";
import { RootState } from "../reducers";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../constants/constants";
import Tooltip from "rc-tooltip";
import InfoIcon from "../assets/icons/info.icon";
import "../styles/SafePeriodBar.scss";

export default function SafePeriodBar() {
  const withdrawSafetyPeriodData: IWithdrawSafetyPeriod = useSelector((state: RootState) => state.dataReducer.withdrawSafetyPeriod);
  const safetyPeriodDate = moment().add(Math.abs(withdrawSafetyPeriodData.timeLeftForSafety), "seconds").local().format('DD-MM-YYYY HH:mm');

  return (
    <>
      {withdrawSafetyPeriodData.timeLeftForSafety !== 0 &&
        <tr>
          <th colSpan={7} className={`safe-period ${withdrawSafetyPeriodData.isSafetyPeriod && "on"}`}>
            <div className="text-wrapper">
              {withdrawSafetyPeriodData.isSafetyPeriod ? <div>{`WITHDRAWAL SAFE PERIOD IS ON UNTIL ${safetyPeriodDate}`}</div> : <div>{`THE NEXT SAFE PERIOD WILL START AT ${safetyPeriodDate}`}</div>}
              <Tooltip
                overlayClassName="tooltip"
                overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
                overlay="Safe period - twice a day and for 1 hour the committee gathers. During that time withdraw is disabled">
                <div style={{ display: "flex", marginLeft: "10px" }}><InfoIcon fill={withdrawSafetyPeriodData.isSafetyPeriod ? Colors.darkBlue : Colors.turquoise} /></div>
              </Tooltip>
            </div>
          </th>
        </tr>}
    </>
  )
}
