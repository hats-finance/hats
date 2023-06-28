import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledVaultDetails = styled.div`
  display: flex;
  flex-direction: column;

  .w-50 {
    width: 50%;

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      width: 100%;
    }
  }

  .sub-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .inputs {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 0 ${getSpacing(2)};

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      flex-direction: column;

      & > div {
        width: 100% !important;
      }
    }

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
