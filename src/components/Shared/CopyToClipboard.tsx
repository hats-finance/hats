import React, { useState, useEffect } from "react";
import Tooltip from "rc-tooltip";
import "../../styles/Shared/CopyToClipboard.scss";
import CopyToClipboardIcon from "../../assets/icons/copyToClipboard.icon";
import { copyToClipboard } from "../../utils";
import CheckmarkIcon from "../../assets/icons/checkmark.icon";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../../constants/constants";

interface IProps {
  value: string
}

export default function CopyToClipboard(props: IProps) {
  const { value } = props;
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHasClicked(false);
    }, 3000);
  }, [hasClicked])

  const handleClick = () => {
    copyToClipboard(value);
    setHasClicked(true);
  }

  return (
    <div className="copy-to-clipboard-wrapper">
      <Tooltip
        placement="top"
        overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
        overlay={hasClicked ? "Copied" : "Copy to clipboard"}
        mouseLeaveDelay={0}>
        <div onClick={handleClick}>{hasClicked ? <CheckmarkIcon width="15px" fill={Colors.turquoise} /> : <CopyToClipboardIcon />}</div>
      </Tooltip>
    </div>
  )
}
