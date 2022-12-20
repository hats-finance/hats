import { getSpacing } from 'styles';
import { breakpointsDefinition } from "styles/breakpoints.styles";
import styled from "styled-components";

export const StyledVaultDetails = styled.div`
  display: flex;
  flex-direction: column;

  .sub-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .inputs {
      width: 55%;

      @media (max-width: ${breakpointsDefinition.mobile}) {
        width: 100%;
      }
    }

    .icons {
      display: flex;
      justify-content: flex-end;

      @media (max-width: ${breakpointsDefinition.mobile}) {
        width: 100%;
      }

      &__input {
        margin-left: 30px;

        @media (max-width: ${breakpointsDefinition.mobile}) {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin-left: 0;
        }
      }
    }
  }

  .dates-container {
    width: 55%;
    display: flex;
    gap: ${getSpacing(3)};

    @media (max-width: ${breakpointsDefinition.mobile}) {
      width: 100%;
    }
  }
`;
