import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";
import styled from "styled-components";

export const StyledDecrypt = styled.div`
  width: 100%;
  margin-bottom: ${getSpacing(5)};

  .title {
    color: var(--white);
    font-size: var(--large);
  }

  .description {
    color: var(--white);
    font-size: var(--small);
    padding-bottom: 30px;
  }

  .textbox-container {
    margin-bottom: ${getSpacing(5)};

    .textbox-title {
      color: var(--white);
    }

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
