import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 3;

  .safety-period-banner {
    width: 100%;
    z-index: 1;
  }

  .content {
    width: 100%;
    padding: ${getSpacing(3)} ${getSpacing(5)};
    display: flex;
    justify-content: space-between;
    background-color: var(--background);
    align-items: center;

    @media (max-width: ${breakpointsDefinition.mobile}) {
      justify-content: flex-end;
      padding: ${getSpacing(2)} ${getSpacing(3)};
    }

    .page-title {
      font-size: var(--large);
      color: var(--white);
      margin-right: 20px;

      @media (max-width: ${breakpointsDefinition.smallScreen}) {
        font-size: var(--medium);
      }

      @media (max-width: ${breakpointsDefinition.mobile}) {
        display: none;
      }
    }

    .buttons {
      display: flex;
      align-items: center;
      gap: ${getSpacing(2.5)};

      .wallet-info {
        @media (max-width: ${breakpointsDefinition.mobile}) {
          display: none;
        }
      }

      .menu-button {
        color: var(--primary);

        @media (min-width: ${breakpointsDefinition.mobile}) {
          display: none;
        }
      }
    }
  }
`;
