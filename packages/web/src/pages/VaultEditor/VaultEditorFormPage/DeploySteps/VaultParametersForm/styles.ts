import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultParametersForm = styled.div`
  .input {
    width: 40%;
    min-width: 220px;
  }

  .bountySplitContainer {
    color: var(--white);
    display: flex;
    gap: ${getSpacing(1)};

    .committeeControlled {
      border: 1px solid var(--secondary);
      padding: ${getSpacing(1.5)};
      flex: 1;

      .controlledSplitForm {
        display: flex;
        flex-direction: column;
        gap: ${getSpacing(1)};
        margin: ${getSpacing(3)} ${getSpacing(0.5)} 0;

        .split {
          width: 100%;
          display: flex;
          align-items: center;

          p {
            display: flex;
            align-items: center;
            flex: 1;
          }

          .inputsContainer {
            display: flex;
            gap: ${getSpacing(1)};
            flex: 1;

            .formInput {
              flex: 2;
            }

            .previewDapp {
              flex: 3;
            }
          }
        }
      }

      p.tiny {
        flex: 1;
        font-size: var(--tiny);
        color: var(--secondary);
      }
    }

    .nonControlled {
      display: flex;
      align-items: flex-start;
      gap: ${getSpacing(1)};
      flex: 1;
      padding: ${getSpacing(1.5)};
    }

    .fixedContainer {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(1)};
    }

    .splitFixedValue {
      width: 100%;
      border: 1px solid var(--grey-700);
      padding: ${getSpacing(1.2)} ${getSpacing(1.6)};

      &.variant {
        border: 1px solid var(--primary-lighter);
        color: var(--primary-lighter);
      }

      p {
        font-weight: 700;
        margin: 0;
        margin-bottom: ${getSpacing(0.6)};
        font-size: var(--small);
      }

      label {
        color: var(--grey-400);
      }
    }
  }
`;

export const StyledTotalSplittedPercentage = styled.p<{ error: boolean }>(
  ({ error }) => css`
    ${error &&
    css`
      color: var(--error-red) !important;
    `}
  `
);
