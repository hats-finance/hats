import { StyledDot, StyledPill } from "./styles";

export type PillProps = {
  dotColor?: "red" | "yellow" | "blue" | "green";
  textColor?: string;
  text: string;
  transparent?: boolean;
  isSeverity?: boolean;
};

export const Pill = ({ dotColor = "blue", text, textColor, transparent = false, isSeverity = false }: PillProps) => {
  return (
    <StyledPill transparent={transparent} textColor={textColor} isSeverity={isSeverity}>
      {!isSeverity && <StyledDot color={dotColor} />}
      <span title={text}>{isSeverity ? text.toLowerCase().replace("severity", "") : text}</span>
    </StyledPill>
  );
};
