import { StyledButton } from "./styles";

export type ButtonProps = {
  styleType?: "filled" | "outlined" | "text";
  size?: "normal" | "small";
  textColor?: "white" | "primary";
  expanded?: boolean;
  lowercase?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export const Button = ({
  styleType = "filled",
  size = "normal",
  lowercase,
  expanded,
  onClick,
  children,
  textColor,
}: ButtonProps) => {
  return (
    <StyledButton
      styleType={styleType}
      size={size}
      expanded={expanded}
      onClick={onClick}
      lowercase={lowercase}
      textColor={textColor}>
      {children}
    </StyledButton>
  );
};
