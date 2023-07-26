import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledDecryptionPage = styled.div`
  position: relative;
  background: var(--background-2);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(6)};

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
