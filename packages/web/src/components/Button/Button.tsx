import { StyledButton } from "./styles";

export type ButtonProps = {
  styleType?: "filled" | "outlined" | "invisible" | "icon" | "text";
  filledColor?: "primary" | "error";
  size?: "normal" | "small" | "big";
  textColor?: "white" | "primary";
  className?: string;
  expanded?: boolean;
  disabled?: boolean;
  noPadding?: boolean;
  lowercase?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export const Button = ({
  styleType = "filled",
  filledColor = "primary",
  size = "normal",
  disabled = false,
  lowercase,
  noPadding,
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
      filledColor={filledColor}
      size={size}
      noPadding={noPadding}
      expanded={expanded}
      disabled={disabled}
      onClick={disabled ? () => {} : onClick}
      lowercase={lowercase}
      textColor={textColor}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
