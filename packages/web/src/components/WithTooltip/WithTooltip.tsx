import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import Tooltip from "rc-tooltip";
import { ReactElement } from "react";

export type WithTooltipProps = {
  children: ReactElement;
  text: string | undefined;
  visible?: boolean;
  placement?: "left" | "right" | "top" | "bottom";
};

export const WithTooltip = ({ children, text, placement, visible }: WithTooltipProps) => {
  if (!text) {
    return children;
  }

  if (visible === true || visible === false) {
    return (
      <Tooltip
        visible={visible}
        overlayClassName="tooltip"
        placement={placement}
        overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE as any}
        overlay={text}
        showArrow={false}
      >
        {children}
      </Tooltip>
    );
  }

  return (
    <Tooltip
      overlayClassName="tooltip"
      placement={placement}
      overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE as any}
      overlay={text}
      showArrow={false}
    >
      {children}
    </Tooltip>
  );
};
