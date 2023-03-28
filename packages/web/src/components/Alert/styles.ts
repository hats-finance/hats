import { getSpacing } from "styles";
import styled, { css } from "styled-components";
import { AlertProps } from "./Alert";

type StyledAlertProps = {
  type: AlertProps["type"];
};

const alertColors = {
  warning: "--warning-yellow",
  error: "--error-red",
};

export const StyledAlert = styled.div<StyledAlertProps>(
  ({ type }) => css`
    border: 1px solid var(${alertColors[type]});
    padding: ${getSpacing(1.5)};
    font-size: var(--xsmall);
    color: var(--white);

    .icon-container {
      display: flex;
      align-items: center;
      gap: ${getSpacing(1)};

      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: ${getSpacing(0.5)};
        width: ${getSpacing(3.5)};
        height: ${getSpacing(3.5)};
        background: var(${alertColors[type]});
        color: var(--black);
      }
    }

    .alert-content {
      margin-top: ${getSpacing(1.5)};
    }
  `
);
