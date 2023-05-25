import { StyledButton } from "./styles";

export type ButtonProps = {
  styleType?: "filled" | "outlined" | "invisible" | "icon" | "text";
  filledColor?: "primary" | "secondary" | "error";
  size?: "normal" | "small" | "big";
  textColor?: "white" | "primary" | "secondary" | "error";
  className?: string;
  expanded?: boolean;
  disabled?: boolean;
  bigHorizontalPadding?: boolean;
  noPadding?: boolean;
  lowercase?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  noRadius?: boolean;
};

export const Button = ({
  styleType = "filled",
  filledColor = "primary",
  size = "normal",
  disabled = false,
  bigHorizontalPadding = false,
  noRadius = false,
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
      noRadius={noRadius}
      textColor={textColor}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
