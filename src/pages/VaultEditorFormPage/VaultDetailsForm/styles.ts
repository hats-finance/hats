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

  .emails {
    width: 100%;
    margin-bottom: ${getSpacing(2)};

    &__item {
      display: flex;

      & > :nth-child(1) {
        width: calc(100% - 160px);
      }

      & > :nth-child(2) {
        width: 160px;
        display: flex;
        justify-content: center;
      }

      &:not(:last-of-type) {
        margin-bottom: ${getSpacing(2)};
      }

      .multiple-buttons {
        display: flex;
        gap: ${getSpacing(1)};
      }
    }
  }

  .icons {
    display: flex;
    justify-content: center;
    gap: ${getSpacing(2)};
  }
`;
