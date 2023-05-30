import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultCard = styled.div<{ isAudit: boolean }>(
  ({ isAudit }) => css`
    display: flex;
    flex-direction: column;
    background: var(--background-2);
    border: 1px solid var(--primary-light);
    padding: ${getSpacing(4)} ${getSpacing(4)};

    .vault-info {
      display: grid;
      grid-template-columns: 3fr 2fr;
      align-items: center;

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

        &__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: ${getSpacing(0.5)};

          .value {
            text-transform: uppercase;
          }

          .sub-value {
            font-size: var(--xxsmall);
            color: var(--grey-500);
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

      .assets {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: ${getSpacing(1)};

        .subtitle {
          color: var(--grey-500);
          font-size: var(--xxsmall);
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
      }
    }
  `
);
