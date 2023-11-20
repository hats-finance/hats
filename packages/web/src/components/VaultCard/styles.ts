import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledVaultCard = styled.div<{
  isAudit: boolean;
  isContinuousAudit?: boolean;
  reducedStyles: boolean;
  hasActiveClaim: boolean;
  showIntendedAmount: boolean;
}>(
  ({ isAudit, isContinuousAudit, reducedStyles, hasActiveClaim, showIntendedAmount }) => css`
    position: relative;
    display: flex;
    flex-direction: column;
    background: ${isContinuousAudit ? "var(--background-2-darker)" : "var(--background-2)"};
    border: 1px solid var(--primary-light);
    padding: ${getSpacing(3)} ${getSpacing(4)};

    ${hasActiveClaim &&
    css`
      padding: ${getSpacing(6)} ${getSpacing(4)} ${getSpacing(4)} ${getSpacing(4)};
      border-color: var(--error-red);
    `}

    ${reducedStyles &&
    css`
      padding: 0;
      border: none;
      background: transparent;
    `}

    @media (max-width: ${breakpointsDefinition.mediumMobile}) {
      padding: ${getSpacing(2.5)} ${getSpacing(3)};

      ${hasActiveClaim &&
      css`
        padding: ${getSpacing(5)} ${getSpacing(2.5)} ${getSpacing(3)} ${getSpacing(2.5)};
      `}
    }

    .pills {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .continuous-comp-hashes {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: ${getSpacing(1)};
      }
    }

    .active-claim-banner {
      background: var(--error-red);
      display: flex;
      align-items: center;
      gap: ${getSpacing(1)};
      justify-content: center;
      width: max-content;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      padding: ${getSpacing(0.5)} ${getSpacing(1.5)};
      border-radius: 0 0 ${getSpacing(1)} ${getSpacing(1)};
      font-size: var(--xxsmall);
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }

    .vault-info {
      display: grid;
      gap: ${getSpacing(2)};
      grid-template-columns: ${reducedStyles ? "2fr 3fr" : "3fr 2fr"};
      align-items: center;

      @media (max-width: ${breakpointsDefinition.mediumMobile}) {
        grid-template-columns: 1fr;
        gap: ${getSpacing(3)};
      }

      .metadata {
        display: flex;
        align-items: center;
        gap: ${getSpacing(2)};

        img {
          width: ${getSpacing(9)};
          height: ${getSpacing(9)};
          border-radius: 50%;
          object-fit: contain;
          cursor: pointer;
          transition: 0.2s;

          &:hover {
            opacity: 0.8;
          }
        }

        .name-description {
          display: flex;
          flex-direction: column;
          gap: ${getSpacing(0.2)};

          .description {
            overflow: hidden;
            display: -webkit-box;
            line-clamp: 3;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }

        .private-audit-indicator {
          font-weight: 700;
          font-style: italic;
          color: var(--secondary);
        }
      }

      .stats {
        display: grid;
        /* grid-template-columns: ${isAudit ? "1fr 1fr" : "1fr 3fr 3fr"}; */
        grid-template-columns: ${isAudit ? "1fr 1fr" : "1fr 1fr"};
        gap: ${getSpacing(1)};
        align-items: center;

        ${reducedStyles &&
        css`
          row-gap: ${getSpacing(3)};
          /* grid-template-columns: ${isAudit ? "1fr 1fr 1fr" : "1fr 2fr 2fr 2fr"}; */
          grid-template-columns: ${isAudit ? "1fr 1fr 1fr" : "1fr 1fr 1fr"};
        `}

        @media (max-width: ${breakpointsDefinition.mediumMobile}) {
          /* grid-template-columns: ${isAudit ? "1fr 1fr" : "1fr 1fr 1fr"}; */
          grid-template-columns: ${isAudit ? "1fr 1fr" : "1fr 1fr"};
          border-color: var(--primary-light);
          border-width: 1px 0 1px;
          border-style: solid;
          padding: ${getSpacing(3)} 0;

          ${reducedStyles &&
          css`
            border-bottom: none;
          `}
        }

        &__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: ${getSpacing(0.5)};

          @media (max-width: ${breakpointsDefinition.mediumMobile}) {
            &:nth-child(2) {
              border-color: var(--primary-light);
              /* border-width: ${isAudit ? "0 0 0 1px" : "0 1px 0"}; */
              border-width: ${isAudit ? "0 0 0 1px" : "0 0 0 1px"};
              border-style: solid;
            }
          }

          &.intended-on-audits {
            ${showIntendedAmount &&
            css`
              color: var(--warning-yellow);
            `}
          }

          .value {
            text-transform: uppercase;
          }

          .sub-value {
            font-size: var(--xxsmall);
            color: var(--grey-400);
          }
        }
      }
    }

    .vault-actions {
      margin-top: ${getSpacing(3)};
      display: grid;
      align-items: flex-start;
      grid-template-columns: ${isAudit ? "2fr 3fr" : "1fr 1fr"};
      gap: ${getSpacing(2)};

      @media (max-width: ${breakpointsDefinition.mediumMobile}) {
        grid-template-columns: 1fr;
      }

      .assets {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: ${getSpacing(1)};

        @media (max-width: ${breakpointsDefinition.mediumMobile}) {
          justify-content: center;
          border-bottom: 1px solid var(--primary-light);
          padding-bottom: ${getSpacing(3)};
          gap: ${getSpacing(2)};
        }

        .subtitle {
          color: var(--grey-400);
          font-size: var(--xxsmall);

          @media (max-width: ${breakpointsDefinition.mediumMobile}) {
            width: 100%;
            text-align: center;
          }
        }
      }

      .actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: ${getSpacing(1)};

        @media (max-width: ${breakpointsDefinition.mediumMobile}) {
          justify-content: space-between;
          gap: ${getSpacing(3)};
          padding: ${getSpacing(1)} 0;

          button {
            width: 100%;

            &:nth-child(1) {
              display: none;
            }
          }
        }
      }
    }
  `
);
