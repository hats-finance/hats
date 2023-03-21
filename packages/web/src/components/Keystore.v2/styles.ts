import styled, { css } from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledBaseKeystoreContainer = styled.div<{ bigger?: boolean }>(
  ({ bigger }) => css`
    color: var(--grey-400);
    width: ${bigger ? "400px" : "380px"};

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      width: 100%;
    }

    p.error {
      font-size: var(--xxsmall);
      color: var(--error-red);
    }
  `
);
