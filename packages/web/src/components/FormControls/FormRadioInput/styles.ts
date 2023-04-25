import styled, { css } from "styled-components";
import { getSpacing } from "styles";

type StyledFormRadioInputProps = {
  hasError: boolean;
  disabled: boolean;
  colorable: boolean;
};

export const StyledFormRadioInput = styled.div<StyledFormRadioInputProps>(
  ({ hasError, disabled, colorable }) => css`
    position: relative;

    .main-container {
      label.main-label {
        display: block;
        margin-bottom: ${getSpacing(1)};

        ${hasError &&
        colorable &&
        css`
          color: var(--error-red);
        `}
      }

      .input-container {
        display: flex;
        align-items: center;
        gap: ${getSpacing(2)};

        .radio-option {
          display: flex;
          align-items: center;
          gap: ${getSpacing(1)};

          & * {
            ${disabled ? "cursor: not-allowed;" : "cursor: pointer;"}
          }
        }
      }
    }

    span.error {
      display: block;
      color: var(--error-red);
      margin-top: ${getSpacing(1)};
      font-size: var(--xxsmall);
    }

    span.helper {
      display: block;
      color: var(--turquoise);
      margin-top: ${getSpacing(0.5)};
      margin-left: ${getSpacing(1)};
      font-size: var(--xxsmall);
    }
  `
);
