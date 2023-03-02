import { getSpacing } from "styles";
import styled, { css } from "styled-components";
import { ButtonProps } from "./Button";

type StyledButtonProps = {
  styleType: ButtonProps["styleType"];
  filledColor: ButtonProps["filledColor"];
  size: ButtonProps["size"];
  noPadding: ButtonProps["noPadding"];
  expanded: ButtonProps["expanded"];
  bigHorizontalPadding: ButtonProps["bigHorizontalPadding"];
  lowercase: ButtonProps["lowercase"];
  textColor: ButtonProps["textColor"];
};

const getVariableByFilledColor = (filledColor: ButtonProps["filledColor"]) => {
  switch (filledColor) {
    case "primary":
      return { backgound: "--turquoise", text: "--dark-blue" };
    case "error":
      return { backgound: "--error-red", text: "--white" };
    default:
      return { backgound: "--turquoise", text: "--dark-blue" };
  }
};

export const StyledButton = styled.button<StyledButtonProps>(
  ({ styleType, filledColor, size, expanded, lowercase, textColor, noPadding, bigHorizontalPadding }) => css`
    display: flex;
    align-items: center;
    width: ${expanded ? "100%" : "fit-content"};
    padding: ${getSpacing(1.2)} ${getSpacing(2)};
    text-transform: ${lowercase ? "lowercase" : "none"};
    font-weight: 600;
    justify-content: ${expanded ? "center" : "unset"};

    ${size === "small" &&
    css`
      padding: ${getSpacing(0.8)} ${getSpacing(1.4)};
    `}

    ${size === "big" &&
    css`
      padding: ${getSpacing(1.8)} ${getSpacing(1.4)};
    `}

    ${styleType === "text" &&
    css`
      display: inline;
      border: none;
      padding: ${getSpacing(0)} ${getSpacing(0.5)};
      margin: 0;
      text-decoration: underline;
      color: ${textColor === "primary" ? "var(--turquoise)" : `var(--${textColor})`}};
    `}

    ${styleType === "filled" &&
    css`
      background-color: var(${getVariableByFilledColor(filledColor).backgound});
      color: var(${getVariableByFilledColor(filledColor).text});
      border-color: var(${getVariableByFilledColor(filledColor).backgound});
    `}
      
    ${styleType === "outlined" &&
    css`
      background-color: transparent;
      border: 1px solid var(--turquoise);
      color: var(--turquoise);
    `}
      
    ${styleType === "invisible" &&
    css`
      background-color: transparent;
      border: none;
      color: ${textColor === "primary" || !textColor ? "var(--turquoise)" : `var(--${textColor})`}};
    `}
      
    ${styleType === "icon" &&
    css`
      padding: ${getSpacing(1.5)} ${getSpacing(1.5)};
      background-color: var(--grey-700);
      border: none;
      border-radius: ${getSpacing(0.5)};
      color: var(--turquoise);
    `}
      
    ${noPadding &&
    css`
      padding: 0;
    `}
      
    ${bigHorizontalPadding &&
    css`
      padding-left: ${getSpacing(8)};
      padding-right: ${getSpacing(8)};
    `}
  `
);
