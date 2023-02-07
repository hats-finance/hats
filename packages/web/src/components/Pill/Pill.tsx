import { StyledPill, StyledCircle } from "./styles";

export type PillProps = {
  color: "red" | "yellow" | "blue";
  text: string;
};

export const Pill = ({ color, text }: PillProps) => {
  return (
    <StyledPill>
      <StyledCircle color={color} />
      <span>{text}</span>
    </StyledPill>
  );
};
