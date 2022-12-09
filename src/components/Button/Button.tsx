import { StyledButton } from "./styles";

export type ButtonProps = {
  styleType?: "filled" | "outlined" | "text";
  onClick?: () => void;
  children: React.ReactNode;
};

export const Button = ({ styleType = "filled", onClick, children }: ButtonProps) => {
  return (
    <StyledButton styleType={styleType} onClick={onClick}>
      {children}
    </StyledButton>
  );
};
