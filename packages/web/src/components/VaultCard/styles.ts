import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledVaultCard = styled.div<{ isAudit: boolean }>(
  ({ isAudit }) => css`
    display: flex;
    flex-direction: column;
    background: var(--background-2);
    border: 1px solid var(--primary-light);
    padding: ${getSpacing(3)} ${getSpacing(4)};

    @media (max-width: ${breakpointsDefinition.mediumMobile}) {
      padding: ${getSpacing(2.5)} ${getSpacing(3)};
    }

    .vault-info {
      display: grid;
      gap: ${getSpacing(2)};
      grid-template-columns: 3fr 2fr;
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
      }

      .stats {
        display: grid;
        grid-template-columns: ${isAudit ? "1fr 1fr" : "1fr 3fr 3fr"};
        gap: ${getSpacing(1)};
        align-items: center;

        @media (max-width: ${breakpointsDefinition.mediumMobile}) {
          grid-template-columns: ${isAudit ? "1fr 1fr" : "1fr 1fr 1fr"};
          border-color: var(--primary-light);
          border-width: 1px 0 1px;
          border-style: solid;
          padding: ${getSpacing(3)} 0;
        }

        &__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: ${getSpacing(0.5)};

          @media (max-width: ${breakpointsDefinition.mediumMobile}) {
            &:nth-child(2) {
              border-color: var(--primary-light);
              border-width: ${isAudit ? "0 0 0 1px" : "0 1px 0"};
              border-style: solid;
            }
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

        .token {
          display: flex;
          align-items: center;
          gap: ${getSpacing(1.5)};
          padding: ${getSpacing(0.6)} ${getSpacing(1)};
          border-radius: 50px;
          background: var(--background-3);
          cursor: pointer;
          transition: 0.2s;

          &:hover {
            opacity: 0.7;
          }

          .images {
            position: relative;
            width: ${getSpacing(2.8)};
            height: ${getSpacing(2.8)};

            img.logo {
              width: ${getSpacing(2.8)};
              height: ${getSpacing(2.8)};
              object-fit: contain;
              border-radius: 500px;
            }

            img.chain {
              width: ${getSpacing(1.5)};
              height: ${getSpacing(1.5)};
              object-fit: contain;
              position: absolute;
              bottom: 0;
              right: -6px;
            }
          }

          span {
            font-size: var(--xxsmall);
            font-weight: 700;
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
