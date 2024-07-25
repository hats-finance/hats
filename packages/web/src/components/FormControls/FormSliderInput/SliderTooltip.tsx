import { SliderProps } from "rc-slider";
import Tooltip, { TooltipRef } from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import raf from "rc-util/lib/raf";
import React from "react";

interface HandleTooltipProps {
  value: number;
  children: React.ReactElement;
  visible: boolean;
  tipFormatter?: (value: number) => React.ReactNode;
}

const HandleTooltip: React.FC<HandleTooltipProps> = (props) => {
  const { value, children, visible, tipFormatter = (val) => `${val} %`, ...restProps } = props;

  const tooltipRef = React.useRef<TooltipRef>();
  const rafRef = React.useRef<number | null>(null);

  function cancelKeepAlign() {
    raf.cancel(rafRef.current!);
  }

  function keepAlign() {
    rafRef.current = raf(() => {
      tooltipRef.current?.forceAlign();
    });
  }

  React.useEffect(() => {
    if (visible) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }

    return cancelKeepAlign;
  }, [value, visible]);

  return (
    <Tooltip
      placement="top"
      overlay={tipFormatter(value)}
      overlayInnerStyle={{ minHeight: "auto", backgroundColor: "#24E8C5", color: "#0E0E18", border: "none", fontWeight: 700 }}
      ref={tooltipRef as any}
      visible={visible}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

export const handleTooltipRender: SliderProps["handleRender"] = (node, props) => (
  <HandleTooltip value={props.value} visible={props.dragging}>
    {node}
  </HandleTooltip>
);
