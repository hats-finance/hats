import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";
import { getSpacing } from "styles";

export const StyledVaultDetails = styled.div`
  display: flex;
  flex-direction: column;

  .sub-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .inputs {
    width: 100%;
    display: flex;
    gap: 0 ${getSpacing(2)};

    &.col-sm {
      @media (max-width: ${breakpointsDefinition.smallMobile}) {
        flex-direction: column;
      }
    }
  }

  .icons {
    display: flex;
    justify-content: center;
    gap: ${getSpacing(2)};
  }
`;
