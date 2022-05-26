import InfoIcon from "assets/icons/info.icon";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import Tooltip from "rc-tooltip";
import "./index.scss";

export default function Assets() {
  return (
    <table className="assets-table">
      <tr>
        <th className="assets-column">Assets</th>
        <th>Staked</th>
        <th className="apy-column">
          <span>APY</span>
          <Tooltip
            overlayClassName="tooltip"
            overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
            overlay="Estimated yearly earnings based on total staked amount and rate reward">
            <div className="info-icon"><InfoIcon fill={Colors.white} /></div>
          </Tooltip>
        </th>
      </tr>
    </table>
  )
}
