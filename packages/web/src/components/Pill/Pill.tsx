import { StyledCircle, StyledPill } from "./styles";

export type PillProps = {
  color: "red" | "yellow" | "blue" | "green";
  text: string;
  transparent?: boolean;
};

export const Pill = ({ color, text, transparent = false }: PillProps) => {
  return (
    <StyledPill transparent={transparent}>
      <StyledCircle color={color} />
      <span>{text}</span>
    </StyledPill>
  );
};
