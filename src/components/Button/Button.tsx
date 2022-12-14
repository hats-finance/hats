import { StyledButton } from "./styles";

export type ButtonProps = {
  styleType?: "filled" | "outlined" | "text";
  size?: "normal" | "small";
  expanded?: boolean;
  lowercase?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export const Button = ({ styleType = "filled", size = "normal", lowercase, expanded, onClick, children }: ButtonProps) => {
  return (
    <StyledButton styleType={styleType} size={size} expanded={expanded} onClick={onClick} lowercase={lowercase}>
      {children}
    </StyledButton>
  );
};
