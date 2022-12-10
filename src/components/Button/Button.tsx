import { StyledButton } from "./styles";

export type ButtonProps = {
  styleType?: "filled" | "outlined" | "text";
  size?: "normal" | "small";
  expanded?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export const Button = ({ styleType = "filled", size = "normal", expanded, onClick, children }: ButtonProps) => {
  return (
    <StyledButton styleType={styleType} size={size} expanded={expanded} onClick={onClick}>
      {children}
    </StyledButton>
  );
};
