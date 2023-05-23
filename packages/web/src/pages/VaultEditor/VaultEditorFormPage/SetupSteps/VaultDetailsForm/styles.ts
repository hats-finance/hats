import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

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

  .repos-information {
    margin-top: ${getSpacing(2)};

    .repo {
      .toggle {
        width: 100%;
        margin-bottom: ${getSpacing(1)};
      }

      .flex {
        display: flex;
        align-items: baseline;
        gap: ${getSpacing(2)};
      }
    }
  }
`;
