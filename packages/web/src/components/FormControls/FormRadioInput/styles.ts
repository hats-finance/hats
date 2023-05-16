import styled, { css } from "styled-components";
import { getSpacing } from "styles";

type StyledFormRadioInputProps = {
  hasError: boolean;
  disabled: boolean;
  colorable: boolean;
  isDirty: boolean;
};

export const StyledFormRadioInput = styled.div<StyledFormRadioInputProps>(
  ({ hasError, disabled, colorable, isDirty }) => css`
    position: relative;

    .main-container {
      margin-bottom: ${getSpacing(3)};

      label.main-label {
        display: block;
        margin-bottom: ${getSpacing(1.5)};
      }

      .input-container {
        display: flex;
        align-items: center;
        gap: ${getSpacing(2)};
        flex-wrap: wrap;

        label.radio-option {
          display: block;
          position: relative;
          padding-left: ${getSpacing(3.5)};
          cursor: pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;

          &:hover {
            input ~ span.checkmark {
              opacity: 0.7;
            }
          }

          & * {
            ${disabled ? "cursor: not-allowed;" : "cursor: pointer;"}
          }

          input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;

            &:checked ~ span.checkmark:after {
              display: block;
            }
          }

          span.checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: ${getSpacing(2.5)};
            width: ${getSpacing(2.5)};
            border-radius: 50%;
            background: var(--dark-blue);
            border: 1px solid var(--turquoise);
            transition: 0.2s;

            ${hasError &&
            colorable &&
            css`
              border-color: var(--error-red);
            `}

            ${isDirty &&
            colorable &&
            css`
              border-color: var(--yellow);
            `}

            &:after {
              content: "";
              position: absolute;
              display: none;
              left: 50%;
              top: 50%;
              border-radius: 50%;
              height: ${getSpacing(1.3)};
              width: ${getSpacing(1.3)};
              background: var(--turquoise);
              transform: translate(-50%, -50%);

              ${hasError &&
              colorable &&
              css`
                background: var(--error-red);
              `}

              ${isDirty &&
              colorable &&
              css`
                background: var(--yellow);
              `}
            }
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
