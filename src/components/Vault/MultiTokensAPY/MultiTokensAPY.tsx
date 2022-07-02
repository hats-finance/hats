import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import Tooltip from "rc-tooltip";

interface IProps {
  apys: { [token: string]: number | undefined };
}

export default function MultiTokensAPY({ apys }: IProps) {
  const apysValues = Object.values(apys);
  const averagedAPY = (apysValues.reduce((a, b) => a! + b!, 0))! / apysValues.length;

  return (
    <Tooltip
      overlay="Averaged APY"
      overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
      placement="top">
      <span>{isNaN(averagedAPY) ? "-" : `${averagedAPY}%`}</span>
    </Tooltip>
  )
}
