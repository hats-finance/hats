import CheckIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import EmptyIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import { StyledDot, StyledPill } from "./styles";

export type PillProps = {
  dotColor?: "red" | "yellow" | "blue" | "green";
  textColor?: string;
  text: string;
  transparent?: boolean;
  isSeverity?: boolean;
  isChecked?: boolean;
  onClick?: () => void;
};

export const Pill = ({
  dotColor = "blue",
  text,
  textColor,
  isChecked,
  transparent = false,
  isSeverity = false,
  onClick,
}: PillProps) => {
  return (
    <StyledPill
      isChecked={isChecked}
      transparent={transparent}
      textColor={textColor}
      isSeverity={isSeverity}
      onClickEnabled={!!onClick}
    >
      {isChecked !== undefined ? isChecked ? <CheckIcon /> : <EmptyIcon /> : undefined}
      {isChecked === undefined && !isSeverity && <StyledDot color={dotColor} />}
      <span title={text}>{text}</span>
    </StyledPill>
  );
};
