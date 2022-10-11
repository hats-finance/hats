import moment from "moment";
import classNames from "classnames";
import { useVaults } from "hooks/useVaults";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import Tooltip from "rc-tooltip";
import InfoIcon from "assets/icons/info.icon";
import "styles/SafePeriodBar.scss";

export default function SafePeriodBar() {
  const { withdrawSafetyPeriod } = useVaults();
  if (!withdrawSafetyPeriod) {
    return null;
  }
  const { isSafetyPeriod, saftyEndsAt, saftyStartsAt } = withdrawSafetyPeriod;
  const safetyPeriodDate = moment.unix(isSafetyPeriod ? saftyEndsAt : saftyStartsAt).local().format('DD-MM-YYYY HH:mm');

  return (
    <tr>
      <th colSpan={7} className={classNames("safe-period", { "on": isSafetyPeriod })}>
        <div className="text-wrapper">
          {isSafetyPeriod ? <div>{`WITHDRAWAL SAFE PERIOD IS ON UNTIL ${safetyPeriodDate}`}</div> : <div>{`THE NEXT SAFE PERIOD WILL START AT ${safetyPeriodDate}`}</div>}
          <Tooltip
            overlayClassName="tooltip"
            overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
            overlay="Safe period - twice a day and for 1 hour the committee gathers. During that time withdraw is disabled">
            <div style={{ display: "flex", marginLeft: "10px" }}><InfoIcon fill={isSafetyPeriod ? Colors.darkBlue : Colors.turquoise} /></div>
          </Tooltip>
        </div>
      </th>
    </tr>
  )
}
