import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledFormPgpPublicKeyInput = styled.div<{ hasError: boolean; isDirty: boolean }>(
  ({ hasError, isDirty }) => css`
    width: 100%;
    position: relative;
    margin-bottom: ${getSpacing(3)};

    .select-button {
      width: 100%;
      margin: 0;
      text-indent: 0;
      background-color: transparent;
      color: var(--white);
      border: 1px solid var(--grey-500);
      resize: none;
      border-radius: 0;
      font-family: inherit;
      color-scheme: dark;
      padding: ${getSpacing(1.5)} ${getSpacing(2)};
      cursor: pointer;

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

      p.placeholder {
        color: var(--grey-600);
        font-family: RobotoMono;
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
