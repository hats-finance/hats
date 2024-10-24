import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledSubmissionDescriptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(2)};
  margin-bottom: ${getSpacing(2)};

  .buttons {
    display: flex;
    justify-content: space-between;
  }
`;

export const StyledSubmissionDescription = styled.div<{ isEncrypted: boolean }>(
  ({ isEncrypted }) => css`
    display: flex;
    flex-direction: column;
    color: var(--white);
    padding: ${getSpacing(3)} ${getSpacing(2.5)};
    border-radius: 4px;
    border: 1px solid var(--primary-light);

    .row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: ${getSpacing(2)};

      @media (max-width: ${breakpointsDefinition.smallMobile}) {
        grid-template-columns: 1fr;
        gap: 0;
      }
    }

    p.title {
      font-weight: 700;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .encryption-info {
        color: ${isEncrypted ? "var(--grey-400)" : "var(--warning-yellow)"};
      }
    }

    .options {
      display: flex;
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
          aspect-ratio: 1;
          border-radius: 50%;
          border: 2px solid var(--primary);

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
              background-color: var(--primary);
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

    .files-attached-container {
      display: flex;
      align-items: center;
      gap: ${getSpacing(1)};
      margin-top: ${getSpacing(3)};

      .files {
        display: flex;
        align-items: center;
        gap: ${getSpacing(2)};
        flex-wrap: wrap;
        flex-direction: column;
        width: 100%;

        li {
          list-style: none;
          display: flex;
          gap: ${getSpacing(5)};
          width: 100%;
          align-items: flex-start;

          .file {
            display: flex;
            align-items: center;
            gap: ${getSpacing(1)};
            border: 1px solid var(--primary);
            border-radius: 50px;
            padding: ${getSpacing(0.5)} ${getSpacing(1)};
            font-size: var(--xxsmall);
            margin-top: ${getSpacing(2)};

            .remove-icon {
              cursor: pointer;
              transition: 0.1s;

              &:hover {
                color: var(--error-red);
              }
            }
          }

          .file-path {
            display: flex;
            align-items: flex-start;
            gap: ${getSpacing(2)};
            width: 100%;

            p {
              white-space: nowrap;
              margin-top: ${getSpacing(2.5)};
            }
          }
        }
      }
    }

    .buttons {
      display: flex;
      justify-content: flex-end;
    }
  `
);
