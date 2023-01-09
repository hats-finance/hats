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

      ${hasError &&
      css`
        color: var(--error-red);
      `}
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
      cursor: pointer;
      width: ${getSpacing(15)};
      height: ${getSpacing(15)};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      border: 1px dashed var(--grey-500);
      color: var(--grey-400);
      padding: ${getSpacing(2)} 0;

      ${isDirty &&
      css`
        border: 1px solid var(--yellow);
      `}

      ${hasError &&
      css`
        border-color: var(--red);
      `}
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
      img {
        object-fit: contain;
        width: 100%;
        height: 100%;
      }

      svg {
        width: 100%;
        height: 100%;
      }
    }

    span.error {
      display: block;
      color: var(--red);
      margin-top: ${getSpacing(0.5)};
      margin-left: ${getSpacing(1)};
      font-size: var(--xxsmall);
    }
  `
);
