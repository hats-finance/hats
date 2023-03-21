import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledKeystoreContainer = styled.div`
  color: var(--white);
  width: 360px;

  @media (max-width: ${breakpointsDefinition.smallMobile}) {
    width: 100%;
  }

  p.error {
    font-size: var(--xxsmall);
    color: var(--error-red);
  }
`;
