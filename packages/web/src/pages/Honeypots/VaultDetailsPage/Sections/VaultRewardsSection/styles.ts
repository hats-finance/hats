import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledRewardsSection = styled.div<{ showIntended: boolean; isAudit: boolean }>(
  ({ showIntended, isAudit }) => css`
    padding-bottom: ${getSpacing(10)};

    .rewards-containers {
      display: grid;
      grid-template-columns: auto 1fr 1fr;
      gap: ${getSpacing(3)};
      flex-grow: 1;

      ${isAudit &&
      css`
        grid-template-columns: 1fr 3fr;
      `}

      @media (max-width: ${breakpointsDefinition.mediumScreen}) {
        grid-template-columns: auto 4fr 5fr;

        ${isAudit &&
        css`
          grid-template-columns: 1fr 2fr;
        `}
      }

      @media (max-width: ${breakpointsDefinition.mediumMobile}) {
        grid-template-columns: 1fr 1fr;

        ${isAudit &&
        css`
          grid-template-columns: 1fr;
        `}
      }

      @media (max-width: ${breakpointsDefinition.smallMobile}) {
        grid-template-columns: 1fr;
      }

      .amounts {
        display: grid;
        grid-template-columns: 1fr;
        gap: ${getSpacing(3)};

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
        max-height: 660px;
        overflow: hidden;

        @media (max-width: ${breakpointsDefinition.smallMobile}) {
          max-height: unset;
          grid-column-start: 1;
          grid-column-end: 3;
        }

        .bonus-points-info-container {
          border-top: 1px solid var(--primary-light);
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: ${getSpacing(1)};
          padding-top: ${getSpacing(3)};

          p {
            font-weight: 700;
          }

          .points {
            display: flex;
            gap: ${getSpacing(2)};

            .point {
              display: flex;
              align-items: center;
              gap: ${getSpacing(1)};

              .secondary-text {
                color: var(--secondary);
                font-weight: 700;
              }

              .primary-text {
                color: var(--primary);
                font-weight: 700;
              }
            }
          }
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

          .values-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: ${getSpacing(0.5)};
          }

          ${showIntended &&
          css`
            h4.value,
            p.value-tokens {
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

        p.value-tokens {
          font-size: var(--xxsmall);
          /* font-weight: 700; */
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
