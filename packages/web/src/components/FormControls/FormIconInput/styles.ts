import { getSpacing } from "styles";
import styled, { css } from "styled-components";

type StyledFormIconInputProps = {
  isDirty: boolean;
  hasError: boolean;
};

export const StyledFormIconInput = styled.div<StyledFormIconInputProps>(
  ({ isDirty, hasError }) => css`
    label {
      display: block;
      color: var(--white);
      font-size: var(--xxsmall);
      text-align: center;
    }

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
      width: ${getSpacing(15)};
      height: ${getSpacing(15)};
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
      }
    }

    .icon-preview {
      padding: ${getSpacing(1)};

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