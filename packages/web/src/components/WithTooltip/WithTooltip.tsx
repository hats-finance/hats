import { ReactElement } from "react";
import Tooltip from "rc-tooltip";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";

export type WithTooltipProps = {
  children: ReactElement;
  text: string;
  placement?: "left" | "right" | "top" | "bottom";
};

export const WithTooltip = ({ children, text, placement }: WithTooltipProps) => {
  return (
    <Tooltip overlayClassName="tooltip" placement={placement} overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE} overlay={text}>
      {children}
    </Tooltip>
  );
};
