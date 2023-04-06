import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledFormPgpPublicKeyInput = styled.div<{
  hasError: boolean;
  isDirty: boolean;
  noMargin: boolean;
  disabled: boolean;
}>(
  ({ hasError, isDirty, noMargin, disabled }) => css`
    position: relative;
    margin-bottom: ${noMargin ? 0 : getSpacing(3)};
    width: 100%;

    .container {
      width: 100%;
      display: flex;
      gap: ${getSpacing(1)};

      .select-button {
        flex: 1;
        margin: 0;
        text-indent: 0;
        background-color: transparent;
        color: var(--white);
        border: 1px solid var(--grey-500);
        resize: none;
        border-radius: 0;
        font-family: inherit;
        color-scheme: dark;
        padding: ${getSpacing(1)} ${getSpacing(2)};
        cursor: pointer;

        ${disabled &&
        css`
          &::after {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: calc(100% - ${hasError ? "20px" : "0px"});
            background-color: var(--disabled-input);
            opacity: 0.4;
            z-index: 1;
            cursor: not-allowed;
          }
        `}

        ${isDirty &&
        css`
          border-color: var(--warning-yellow);
        `}

      ${hasError &&
        css`
          border-color: var(--error-red);
        `}

      label {
          font-size: var(--xxsmall);
          display: block;
          color: var(--grey-500);
          padding-bottom: ${getSpacing(0.6)};
          cursor: pointer;
        }

        p {
          margin: 0;

          &.placeholder {
            color: var(--grey-500);
            font-family: RobotoMono;
          }
        }
      }
    }

    span.error {
      display: block;
      color: var(--error-red);
      margin-top: ${getSpacing(0.5)};
      margin-left: ${getSpacing(1)};
      font-size: var(--xxsmall);
    }
  `
);

export const StyledPgpPublicKeyInputModal = styled.div`
  display: flex;
  flex-direction: column;
  white-space: pre-line;
  max-width: 550px;

  .description {
    margin: ${getSpacing(2)} 0;
    color: var(--white);
  }

  hr {
    width: 100%;
    border-color: var(--grey-500);
    margin-top: ${getSpacing(3)};
  }
`;
