import { getSpacing } from "styles";
import styled, { css } from "styled-components";
import { ButtonProps } from "./Button";

type StyledButtonProps = {
  styleType: ButtonProps["styleType"];
};

export const StyledButton = styled.button<StyledButtonProps>(
  ({ styleType }) => css`
    ${styleType === "text" &&
    css`
      display: inline;
      border: none;
      padding: ${getSpacing(0)} ${getSpacing(0.5)};
      margin: 0;
      text-decoration: underline;
      color: var(--turquoise);
    `}
  `
);
