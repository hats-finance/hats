import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledMyAccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--white);
  min-width: 500px;

  @media (max-width: ${breakpointsDefinition.smallMobile}) {
    min-width: unset;
    max-width: unset;
    width: 100%;
  }

  .wallet {
    display: flex;
    flex-direction: column;

    &__hello {
      font-weight: bold;
      font-size: var(--moderate);
    }

    &__address {
      font-size: var(--medium);
    }
  }

  .stats-boxs {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
  }
`;
