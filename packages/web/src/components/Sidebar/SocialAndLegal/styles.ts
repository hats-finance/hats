import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledSocialAndLegal = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .social-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${getSpacing(1)};
    padding: 0 ${getSpacing(2)};

    @media (max-width: ${breakpointsDefinition.smallScreen}) {
      gap: ${getSpacing(0.5)};
    }

    a svg {
      width: ${getSpacing(3.5)};

      @media (max-width: ${breakpointsDefinition.smallScreen}) {
        width: ${getSpacing(2.5)};
      }
    }
  }
`;
