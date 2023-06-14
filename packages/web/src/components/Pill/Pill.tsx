import CheckIcon from "@mui/icons-material/CheckOutlined";
import ClearIcon from "@mui/icons-material/ClearOutlined";
import { StyledDot, StyledPill } from "./styles";

export type PillProps = {
  dotColor?: "red" | "yellow" | "blue" | "green";
  textColor?: string;
  text: string;
  transparent?: boolean;
  isSeverity?: boolean;
  isChecked?: boolean;
};

export const Pill = ({ dotColor = "blue", text, textColor, isChecked, transparent = false, isSeverity = false }: PillProps) => {
  return (
    <StyledPill isChecked={isChecked} transparent={transparent} textColor={textColor} isSeverity={isSeverity}>
      {isChecked !== undefined ? isChecked ? <CheckIcon /> : <ClearIcon /> : undefined}
      {isChecked === undefined && !isSeverity && <StyledDot color={dotColor} />}
      <span title={text}>{text}</span>
    </StyledPill>
  );
};
