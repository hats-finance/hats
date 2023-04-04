import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";
import styled from "styled-components";

export const StyledDecrypt = styled.div`
  color: var(--white);
  width: 100%;
  margin-bottom: ${getSpacing(5)};

  .title {
    font-size: var(--large);
  }

  .textbox-container {
    margin-bottom: ${getSpacing(5)};

    button {
      @media (max-width: ${breakpointsDefinition.mobile}) {
        width: 100%;
        margin: 20px 0 0;
      }
    }
  }

  .button {
    padding: 8px 30px;
    font-size: 16px;
    text-transform: uppercase;
  }
`;
