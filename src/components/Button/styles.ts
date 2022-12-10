import { getSpacing } from "styles";
import styled, { css } from "styled-components";
import { ButtonProps } from "./Button";

type StyledButtonProps = {
  styleType: ButtonProps["styleType"];
  size: ButtonProps["size"];
  expanded: ButtonProps["expanded"];
};

export const StyledButton = styled.button<StyledButtonProps>(
  ({ styleType, size, expanded }) => css`
    display: block;
    width: ${expanded ? "100%" : "fit-content"};
    padding: ${getSpacing(1.2)} ${getSpacing(2)};
    text-transform: uppercase;
    font-weight: 600;

    ${size === "small" &&
    css`
      padding: ${getSpacing(0.8)} ${getSpacing(1.4)};
    `}

    ${styleType === "text" &&
    css`
      display: inline;
      border: none;
      padding: ${getSpacing(0)} ${getSpacing(0.5)};
      margin: 0;
      text-decoration: underline;
      color: var(--turquoise);
    `}

    ${styleType === "filled" &&
    css`
      background-color: var(--turquoise);
      color: var(--dark-blue);
    `}
      
    ${styleType === "outlined" &&
    css`
      background-color: transparent;
      border: 1px solid var(--turquoise);
      color: var(--turquoise);
    `}
  `
);
