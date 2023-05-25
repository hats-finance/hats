import styled, { css } from "styled-components";
import { getSpacing } from "styles";
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
  noRadius: ButtonProps["noRadius"];
};

const getVariableByFilledColor = (filledColor: ButtonProps["filledColor"]) => {
  switch (filledColor) {
    case "error":
      return { backgound: "--error-red", text: "--white" };
    case "secondary":
      return { backgound: "--secondary", text: "--background" };
    case "primary":
    default:
      return { backgound: "--primary", text: "--white" };
  }
};

const getVariableByTextColor = (filledColor: ButtonProps["textColor"]) => {
  switch (filledColor) {
    case "secondary":
      return "--secondary";
    case "primary":
      return "--primary";
    case "error":
      return "--error-red";
    default:
      return "--white";
  }
};

export const StyledButton = styled.button<StyledButtonProps>(
  ({ styleType, filledColor, size, expanded, lowercase, textColor, noPadding, bigHorizontalPadding, noRadius }) => css`
    display: flex;
    align-items: center;
    width: ${expanded ? "100%" : "fit-content"};
    padding: ${getSpacing(1.4)} ${getSpacing(3)};
    text-transform: ${lowercase ? "lowercase" : "none"};
    font-weight: 600;
    justify-content: ${expanded ? "center" : "unset"};
    border-radius: ${noRadius ? "0" : "500px"};

    ${size === "small" &&
    css`
      padding: ${getSpacing(0)} ${getSpacing(1.8)};
    `}

    ${size === "big" &&
    css`
      padding: ${getSpacing(1.8)} ${getSpacing(3.6)};
    `}

    ${styleType === "text" &&
    css`
      display: inline;
      border: none;
      padding: ${getSpacing(0)} ${getSpacing(0.5)};
      margin: 0;
      text-decoration: underline;
      color: var(${getVariableByTextColor(textColor)});
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
      border: 1px solid var(${getVariableByFilledColor(filledColor).backgound});
      color: var(--white);
    `}
      
    ${styleType === "invisible" &&
    css`
      background-color: transparent;
      border: none;
      color: var(${getVariableByTextColor(textColor)});
    `}
      
    ${styleType === "icon" &&
    css`
      padding: ${getSpacing(1.5)} ${getSpacing(1.5)};
      background-color: var(--grey-700);
      border: none;
      border-radius: ${getSpacing(0.5)};
      color: var(--primary);
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
