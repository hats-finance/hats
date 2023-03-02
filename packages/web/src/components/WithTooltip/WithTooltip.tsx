import { ReactElement } from "react";
import Tooltip from "rc-tooltip";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";

export type WithTooltipProps = {
  children: ReactElement;
  text: string;
};

export const WithTooltip = ({ children, text }: WithTooltipProps) => {
  return (
    <Tooltip overlayClassName="tooltip" overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE} overlay={text}>
      {children}
    </Tooltip>
  );
};
