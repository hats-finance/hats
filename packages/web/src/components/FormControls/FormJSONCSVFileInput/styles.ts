import styled, { css } from "styled-components";
import { getSpacing } from "styles";

type StyledFormJSONCSVFileInputProps = {
  isDirty: boolean;
  hasError: boolean;
  disabled: boolean;
};

export const StyledFormJSONCSVFileInput = styled.div<StyledFormJSONCSVFileInputProps>(
  ({ isDirty, hasError, disabled }) => css`
    position: relative;

    label {
      display: block;
      color: var(--white);
      font-size: var(--xxsmall);
      text-align: center;
    }

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

    .file-input {
      position: absolute;
      opacity: 0;
      flex: 0 1;
      width: 0;
      height: 0;
      padding: 0;
      margin: 0;
    }

    .icon-add,
    .icon-preview {
      position: relative;
      cursor: pointer;
      width: 100%;
      height: ${getSpacing(18)};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      border: 1px dashed var(--grey-500);
      color: var(--grey-500);
      padding: ${getSpacing(2)} 0;

      ${isDirty &&
      css`
        border: 1px solid var(--yellow);
      `}

      ${hasError &&
      css`
        border-color: var(--error-red);
      `}

      label {
        cursor: pointer;
      }
    }

    .icon-add {
      font-size: var(--tiny);

      img {
        filter: grayscale(1);
        width: ${getSpacing(3)};
        height: ${getSpacing(3)};
        margin-bottom: ${getSpacing(0.5)};
      }
    }

    .icon-preview {
      padding: ${getSpacing(1)};
      display: flex;
      justify-content: center;
      align-items: center;

      label {
        position: absolute;
        top: ${getSpacing(1)};
        background: black;
        opacity: 0.5;
        padding: ${getSpacing(0.2)} ${getSpacing(0.6)};
        border-radius: 4px;
      }

      p {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
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
