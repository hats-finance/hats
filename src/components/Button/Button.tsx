import { StyledButton } from "./styles";

export type ButtonProps = {
  styleType?: "filled" | "outlined" | "invisible" | "icon" | "text";
  size?: "normal" | "small";
  textColor?: "white" | "primary";
  className?: string;
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
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      type="button"
      styleType={styleType}
      size={size}
      expanded={expanded}
      onClick={onClick}
      lowercase={lowercase}
      textColor={textColor}
      {...props}>
      {children}
    </StyledButton>
  );
};
