import styled, { css } from "styled-components";
import { getSpacing } from "styles";

type StyledFormIconInputProps = {
  isDirty: boolean;
  hasError: boolean;
  disabled: boolean;
};

export const StyledFormIconInput = styled.div<StyledFormIconInputProps>(
  ({ isDirty, hasError, disabled }) => css`
    position: relative;
    width: ${getSpacing(12)};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

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

    .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: ${getSpacing(0.5)};

      p {
        text-align: center;
        color: var(--grey-500);
        font-size: var(--tiny);
      }
    }

    .icon-add,
    .icon-preview {
      position: relative;
      cursor: pointer;
      width: ${getSpacing(10)};
      height: ${getSpacing(10)};
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
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        filter: grayscale(1);
        width: ${getSpacing(3.5)};
        height: ${getSpacing(3.5)};
        margin-bottom: ${getSpacing(0.5)};
      }
    }

    .icon-preview {
      padding: ${getSpacing(0.5)};

      label {
        position: absolute;
        top: ${getSpacing(1)};
        background: black;
        opacity: 0.5;
        padding: ${getSpacing(0.2)} ${getSpacing(0.6)};
        border-radius: 4px;
      }

      img {
        object-fit: contain;
        width: 100%;
        height: 100%;
      }

      div {
        width: 100%;
        height: 100%;

        svg {
          width: 100%;
          height: 100%;
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
