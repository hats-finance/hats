import moment from "moment";
import classNames from "classnames";
import { useVaults } from "hooks/useVaults";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import Tooltip from "rc-tooltip";
import InfoIcon from "assets/icons/info.icon";
import "styles/SafePeriodBar.scss";
import { useTranslation } from "react-i18next";

export default function SafePeriodBar() {
  const { t } = useTranslation();
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
          {isSafetyPeriod ? <div>{`${t("SafePeriodBar.text-0")} ${safetyPeriodDate}`}</div> : <div>{`${t("SafePeriodBar.text-1")} ${safetyPeriodDate}`}</div>}
          <Tooltip
            overlayClassName="tooltip"
            overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
            overlay={t("SafePeriodBar.text-2")}>
            <div style={{ display: "flex", marginLeft: "10px" }}><InfoIcon fill={isSafetyPeriod ? Colors.darkBlue : Colors.turquoise} /></div>
          </Tooltip>
        </div>
      </th>
    </tr>
  )
}
