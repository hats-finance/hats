import { useState, useEffect } from "react";
import CopyIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckIcon from "@mui/icons-material/CheckOutlined";
import { WithTooltip } from "../WithTooltip/WithTooltip";
import { useTranslation } from "react-i18next";
import { StyledCopyToClipboard } from "./styles";

interface IProps {
  valueToCopy: string;
  overlayText?: string;
}

export function CopyToClipboard({ valueToCopy, overlayText }: IProps) {
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
    <StyledCopyToClipboard>
      <WithTooltip text={hasClicked ? t("copied") : overlayText ?? t("copyToClipboard")}>
        <div className="copy-button" onClick={handleCopy}>
          {hasClicked ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
        </div>
      </WithTooltip>
    </StyledCopyToClipboard>
  );
}
