import { breakpointsDefinition } from "./../../styles/breakpoints.styles";
import styled from "styled-components";

export const StyledMyAccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--white);
  padding: var(--modal-element-padding);
  min-width: 600px;
  max-width: 600px;
  padding-top: 0px;
  margin: auto;
  max-height: 650px;

  @media (max-width: ${breakpointsDefinition.mobile}) {
    padding: var(--modal-element-padding-mobile);
    min-width: unset;
  }

  @media (max-width: ${breakpointsDefinition.smallScreen}) {
    max-height: 500px;
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
