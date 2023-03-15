import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultStatusPage = styled.div`
  position: relative;
  background: var(--background-clear-blue);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(8)} !important;

  .status-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--white);
    font-size: var(--moderate);
    margin-bottom: ${getSpacing(2)};
    padding-bottom: ${getSpacing(4)};
    border-bottom: 1px solid var(--grey-600);

    .leftSide {
      .role {
        font-size: var(--xsmall);
        color: var(--grey-500);
      }

      .title {
        span {
          font-weight: 700;
        }
      }
    }
  }

  .status-cards {
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(2.5)};
    color: var(--white);

    .status-card {
      display: flex;
      flex-direction: column;
      background: var(--background-clearer-blue);
      border-radius: 4px;
      padding: ${getSpacing(2)};

      &__title {
        margin-bottom: ${getSpacing(1.5)};
        text-transform: uppercase;
        font-weight: 700;
        font-size: var(--small);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: ${getSpacing(2)};

        .leftSide {
          display: flex;
          align-items: center;
          gap: ${getSpacing(2)};
        }

        .reload {
          cursor: pointer;
          transition: 0.2s;
          transform-origin: center;

          &:hover {
            opacity: 0.8;
          }

          &:active {
            transform: rotate(-180deg);
          }
        }

        .chain-logo {
          img {
            width: ${getSpacing(3)};
            height: ${getSpacing(3)};
          }
        }
      }

      &__deposited {
        display: flex;
        gap: ${getSpacing(3)};
        margin-top: ${getSpacing(2)};

        .field {
          width: 100%;

          .title {
            color: var(--grey-500);
          }

          .value {
            padding: ${getSpacing(1)} ${getSpacing(2.5)};
            height: ${getSpacing(7)};
            border: 1px solid var(--grey-600);
            display: flex;
            align-items: center;
            gap: ${getSpacing(1.5)};
            margin-top: ${getSpacing(1.5)};

            img {
              width: ${getSpacing(3.5)};
              height: ${getSpacing(3.5)};
            }

            p {
              font-weight: 700;
            }
          }
        }
      }

      &__text {
        margin-bottom: ${getSpacing(1)};
        line-height: ${getSpacing(2.5)};
      }

      &__error {
        margin-top: ${getSpacing(1)};
        font-size: var(--xxsmall);
        color: var(--error-red);
      }

      &__buttons {
        margin-top: ${getSpacing(3)};
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      &__button {
        margin-top: ${getSpacing(3)};
        align-self: flex-end;
      }

      &__edit-sessions {
        display: flex;
        flex-direction: column;
        gap: ${getSpacing(2)};
        margin-bottom: ${getSpacing(3)};
        margin-top: ${getSpacing(2)};
        border-top: 1px solid var(--grey-600);

        .edit-sessions-title {
          font-weight: 700;
          margin-top: ${getSpacing(2)};
        }

        .edit-session {
          width: 100%;
          display: grid;
          align-items: center;
          grid-template-columns: 1fr 1fr 1fr;

          .box {
            text-align: left;

            .createdAt {
              font-size: var(--tiny);
            }
          }

          .status,
          .actions {
            display: flex;
            justify-content: end;
          }
        }
      }
    }
  }

  .vault-error {
    padding: ${getSpacing(0.5)} ${getSpacing(1)};
    border-radius: 4px;
    color: var(--white);
    background: var(--error-red);
    opacity: 0.8;
    width: fit-content;
    font-size: var(--xxsmall);
  }
`;
