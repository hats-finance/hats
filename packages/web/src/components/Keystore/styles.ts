import styled, { css } from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";
import { getSpacing } from "styles";

export const StyledBaseKeystoreContainer = styled.div<{ size?: "small" | "medium" | "big" | "bigger" }>(
  ({ size = "small" }) => css`
    color: var(--grey-400);

    ${size === "small" &&
    css`
      width: 330px;
    `}

    ${size === "medium" &&
    css`
      width: 390px;
    `}

    ${size === "big" &&
    css`
      width: 520px;
    `}

    ${size === "bigger" &&
    css`
      width: 550px;
    `}

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      width: 100%;
    }

    p.error {
      font-size: var(--xxsmall);
      color: var(--error-red);
    }

    p b {
      font-weight: 900;
      color: var(--warning-yellow);
    }

    .buttons-row {
      display: flex;
      gap: ${getSpacing(4)};
    }
  `
);
