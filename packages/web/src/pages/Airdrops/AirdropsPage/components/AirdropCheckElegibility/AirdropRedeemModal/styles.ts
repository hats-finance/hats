import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledAirdropRedeemModal = styled.div`
  width: 450px;
  max-width: 100%;

  .content-modal {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    margin-top: ${getSpacing(2)};
    padding: 0 ${getSpacing(1)};

    img.banner {
      margin: 0 auto;
      width: ${getSpacing(24)};
      margin-bottom: ${getSpacing(5)};
    }

    h2 {
      text-align: center;
      margin-bottom: ${getSpacing(4)};
    }

    ol,
    ul {
      margin-top: ${getSpacing(2)};
      padding-left: ${getSpacing(2.5)};

      li {
        margin-top: ${getSpacing(1)};
      }
    }

    .quiz-answers {
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(2)};
      margin-top: ${getSpacing(3)};

      .answer {
        display: flex;
        align-items: center;
        gap: ${getSpacing(1)};
        border: 1px solid var(--primary);
        border-radius: 100px;
        padding: ${getSpacing(2)} ${getSpacing(3)};
        cursor: pointer;
        transition: 0.1s;

        &:hover {
          opacity: 0.7;
        }

        &.selected {
          background-color: var(--primary-light);
          color: white;
        }

        &.correct {
          border-color: var(--secondary);
          border-width: 2px;
          background-color: var(--primary-light);
        }

        p {
          margin: 0;
          flex: 1;
          text-align: center;
        }

        span.correctIcon {
          color: var(--secondary);
          font-weight: 700;
        }

        span.incorrectIcon {
          color: var(--error-red);
          font-weight: 700;
        }
      }
    }

    .delegatees-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: ${getSpacing(2)};
      margin-top: ${getSpacing(2)};
      height: 520px;
    }

    .locked-info {
      margin: ${getSpacing(2)} 0;
      padding-bottom: ${getSpacing(2)};
      border-bottom: 1px solid var(--primary-light);

      .locked-amount {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${getSpacing(1.5)};
        margin-bottom: ${getSpacing(1)};

        &-token {
          display: flex;
          align-items: center;
          gap: ${getSpacing(1)};
        }
      }

      .explanation {
        font-size: var(--xxsmall);
      }
    }

    .elegibility-breakdown {
      .breakdown {
        display: flex;
        flex-direction: column;
        gap: ${getSpacing(1.5)};
        border-bottom: 1px solid var(--grey-500);
        padding-bottom: ${getSpacing(1.5)};

        &-item {
          display: flex;
          justify-content: space-between;

          .left {
            display: flex;

            .check {
              color: var(--grey-600);
              width: ${getSpacing(2.5)};
            }
          }

          &.eligible {
            .left .check {
              color: var(--secondary);
            }
          }

          &:not(.eligible) {
            color: var(--grey-600);
          }
        }
      }

      .total {
        padding-top: ${getSpacing(1.5)};
        display: flex;
        justify-content: space-between;
        font-weight: 700;
      }
    }

    .deposit-amount {
      .top-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .amount-to-deposit {
        width: 100%;
        padding: ${getSpacing(3)} ${getSpacing(2)};
        border: 1px solid var(--primary);
        background: var(--background);
        font-weight: 700;
        margin-top: ${getSpacing(2)};
        margin-bottom: ${getSpacing(3)};
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: ${getSpacing(6)} 0 ${getSpacing(2)};

      &.center {
        justify-content: center;
      }

      .left {
        display: flex;
        gap: ${getSpacing(1)};
      }
    }
  }
`;

export const StyledDelegateeCard = styled.div<{ selected: boolean }>(
  ({ selected }) => css`
    border: 1px solid var(--primary);
    border-radius: ${getSpacing(1.5)};
    padding: ${getSpacing(2)} ${getSpacing(1.5)} ${getSpacing(0.5)};
    position: relative;
    cursor: pointer;
    transition: 0.1s;

    &:hover {
      background-color: var(--primary-light);
    }

    ${selected &&
    css`
      background-color: var(--primary-light);
      border: 1px solid var(--secondary);
    `}

    .icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: ${getSpacing(2)};

      img {
        width: 100%;
        height: 100%;
      }
    }

    .votes {
      background: var(--primary);
      font-weight: 700;
      position: absolute;
      top: 20px;
      right: 0;
      padding: ${getSpacing(0.5)} ${getSpacing(2)};
      border-radius: 50px 0 0 50px;
      font-size: var(--xxsmall);
    }

    .address {
      font-size: var(--xxsmall);
      color: var(--grey-400);
    }

    .name {
      font-weight: 700;
      font-size: var(--small);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--primary);
    }

    .description {
      ol,
      ul {
        margin-top: 0;
        padding-left: ${getSpacing(2.5)};
        display: flex;
        flex-direction: column;
        gap: ${getSpacing(0.5)};
        font-size: var(--xxsmall);

        li {
          margin: 0;
          padding: 0;
        }
      }
    }
  `
);
