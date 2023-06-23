import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledRewardsSection = styled.div<{ showIntended: boolean }>(
  ({ showIntended }) => css`
    padding-bottom: ${getSpacing(10)};

    .rewards-containers {
      display: grid;
      grid-template-columns: auto 1fr 1fr;
      gap: ${getSpacing(1.5)};
      flex-grow: 1;

      @media (max-width: ${breakpointsDefinition.mediumScreen}) {
        grid-template-columns: auto 4fr 5fr;
      }

      @media (max-width: ${breakpointsDefinition.mediumMobile}) {
        grid-template-columns: 1fr 1fr;
      }

      @media (max-width: ${breakpointsDefinition.smallMobile}) {
        grid-template-columns: 1fr;
      }

      .amounts {
        display: grid;
        grid-template-columns: 1fr;
        gap: ${getSpacing(1.5)};

        @media (max-width: ${breakpointsDefinition.mediumMobile}) {
          grid-template-columns: 1fr;
          grid-column-start: 1;
          grid-column-end: 3;
        }
      }

      .division {
        @media (max-width: ${breakpointsDefinition.smallMobile}) {
          grid-column-start: 1;
          grid-column-end: 3;
        }
      }

      .severities-rewards {
        max-height: 500px;
        overflow: hidden;

        @media (max-width: ${breakpointsDefinition.smallMobile}) {
          grid-column-start: 1;
          grid-column-end: 3;
        }
      }

      .card {
        border: 1px solid var(--primary-light);
        padding: ${getSpacing(4)} ${getSpacing(6)};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: ${getSpacing(2)};
        width: 100%;
        height: 100%;

        &.amount-card {
          padding: ${getSpacing(5)} ${getSpacing(showIntended ? 4 : 6)};

          @media (max-width: ${breakpointsDefinition.mediumScreen}) {
            padding: ${getSpacing(showIntended ? 4 : 5)};
          }

          ${showIntended &&
          css`
            h4.value {
              color: var(--warning-yellow);
            }
          `}
        }

        @media (max-width: ${breakpointsDefinition.mediumScreen}) {
          padding: ${getSpacing(4)};
        }

        h4.title {
          color: var(--grey-400);
          font-size: var(--small);
        }

        h4.value {
          font-size: var(--medium);
        }

        .chart-container {
          margin-top: ${getSpacing(4)};
          width: 70%;

          @media (max-width: ${breakpointsDefinition.smallScreen}) {
            width: 85%;
          }

          @media (max-width: ${breakpointsDefinition.smallMobile}) {
            width: 60%;
          }
        }
      }
    }
  `
);
