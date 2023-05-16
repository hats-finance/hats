import styled, { css } from "styled-components";
import { getSpacing } from "styles";

type StyledFormSupportFilesInputProps = {
  isDirty: boolean;
  hasError: boolean;
};
export const StyledFormSupportFilesInput = styled.div<StyledFormSupportFilesInputProps>(
  ({ isDirty, hasError }) => css`
    position: relative;

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

    .icon-add {
      position: relative;
      cursor: pointer;
      width: 100%;
      height: ${getSpacing(7)};
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border: 1px dashed var(--grey-500);
      padding: ${getSpacing(2)} 0;
      gap: ${getSpacing(1)};
      font-size: var(--xsmall);

      ${isDirty &&
      css`
        border: 1px solid var(--yellow);
      `}

      ${hasError &&
      css`
        border-color: var(--error-red);
      `}

      .icon {
        color: var(--grey-400);
      }

      label {
        cursor: pointer;
      }
    }

    .files-attached-container {
      display: flex;
      align-items: center;
      gap: ${getSpacing(1)};
      margin-top: ${getSpacing(2)};

      .files {
        display: flex;
        align-items: center;
        gap: ${getSpacing(1.5)};
        flex-wrap: wrap;

        li {
          display: flex;
          align-items: center;
          gap: ${getSpacing(1)};
          list-style: none;
          border: 1px solid var(--turquoise);
          border-radius: 50px;
          padding: ${getSpacing(0.5)} ${getSpacing(1)};
          font-size: var(--xxsmall);

          .remove-icon {
            cursor: pointer;
            transition: 0.1s;

            &:hover {
              color: var(--error-red);
            }
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
