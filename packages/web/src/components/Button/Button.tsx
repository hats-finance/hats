import { StyledButton } from "./styles";

export type ButtonProps = {
  styleType?: "filled" | "outlined" | "invisible" | "icon" | "text";
  filledColor?: "primary" | "error";
  size?: "normal" | "small" | "big";
  textColor?: "white" | "primary";
  className?: string;
  expanded?: boolean;
  disabled?: boolean;
  bigHorizontalPadding?: boolean;
  noPadding?: boolean;
  lowercase?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
};

export const Button = ({
  styleType = "filled",
  filledColor = "primary",
  size = "normal",
  disabled = false,
  bigHorizontalPadding = false,
  type = "button",
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
      type={type}
      styleType={styleType}
      filledColor={filledColor}
      size={size}
      noPadding={noPadding}
      bigHorizontalPadding={bigHorizontalPadding}
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
