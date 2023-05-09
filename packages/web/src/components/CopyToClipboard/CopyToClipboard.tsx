import CheckIcon from "@mui/icons-material/CheckOutlined";
import CopyIcon from "@mui/icons-material/ContentCopyOutlined";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { WithTooltip } from "../WithTooltip/WithTooltip";
import { StyledCopyToClipboard } from "./styles";

interface IProps {
  valueToCopy: string;
  overlayText?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  simple?: boolean;
}

export function CopyToClipboard({ valueToCopy, overlayText, tooltipPlacement = "left", simple = false }: IProps) {
  const { t } = useTranslation();

  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    setTimeout(() => setHasClicked(false), 3000);
  }, [hasClicked]);

  const handleCopy = () => {
    navigator.clipboard.writeText(valueToCopy).finally(() => {
      setHasClicked(true);
    });
  };

  return (
    <StyledCopyToClipboard simple={simple}>
      <WithTooltip placement={tooltipPlacement} text={hasClicked ? t("copied") : overlayText ?? t("copyToClipboard")}>
        <div className="copy-button" onClick={handleCopy}>
          {hasClicked ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
        </div>
      </WithTooltip>
    </StyledCopyToClipboard>
  );
}
