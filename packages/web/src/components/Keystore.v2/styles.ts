import styled, { css } from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledBaseKeystoreContainer = styled.div<{ size?: "small" | "medium" | "big" }>(
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
  `
);
