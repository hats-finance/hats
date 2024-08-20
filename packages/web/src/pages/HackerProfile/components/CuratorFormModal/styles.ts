import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledCuratorFormModal = styled.div<{ firstStep: boolean }>(
  ({ firstStep }) => css`
    width: 460px;
    max-width: 90vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: ${getSpacing(2)};

    .alerts {
      margin-top: ${getSpacing(3)};
      width: 100%;
    }

    .hats-boat {
      margin: ${getSpacing(4)} 0;
      width: ${getSpacing(20)};
    }

    .curator-step {
      width: 100%;
      font-size: var(--xsmall);
      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        font-size: var(--moderate);
        font-weight: 700;
        margin-bottom: ${getSpacing(3)};
        text-align: center;
      }

      ul {
        padding-left: ${getSpacing(3)};
      }

      .row {
        width: 100%;
        display: flex;
        align-items: center;
        gap: ${getSpacing(2)};
      }

      .options {
        display: flex;
        flex-direction: column;
        gap: ${getSpacing(3)};
        width: 100%;

        .option {
          display: flex;
          gap: ${getSpacing(2)};
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            opacity: 0.8;
          }

          .check-circle {
            width: ${getSpacing(2.5)};
            height: ${getSpacing(2.5)};
            border-radius: 50%;
            border: 2px solid var(--grey-400);

            &.selected {
              position: relative;

              &::after {
                content: "";
                width: ${getSpacing(1.2)};
                height: ${getSpacing(1.2)};
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-43%, -50%);
                position: absolute;
                background-color: var(--grey-400);
                display: block;
              }
            }

            &.error {
              border-color: var(--error-red);

              &::after {
                background-color: var(--error-red);
              }
            }
          }
          .info {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: ${getSpacing(0.5)};
          }
        }
      }

      a {
        color: var(--secondary);
      }

      .socials {
        display: flex;
        gap: ${getSpacing(2)};
        margin-top: ${getSpacing(4)};

        svg {
          width: ${getSpacing(6)};
          height: ${getSpacing(6)};
        }
      }
    }

    .buttons {
      width: 100%;
      display: flex;
      justify-content: ${firstStep ? "center" : "space-between"};
      align-items: center;
      margin-top: ${getSpacing(5)};
      padding-bottom: ${getSpacing(4)};
    }

    .w-100 {
      width: 100%;
    }
  `
);
