import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { FormInputType } from "./FormInput";

type StyledFormInputProps = {
  isDirty: boolean;
  hasError: boolean;
  withExtraicons: boolean;
  isCheckOrRadio: boolean;
  type: FormInputType;
};

export const StyledFormInput = styled.div<StyledFormInputProps>(
  ({ isDirty, type, withExtraicons, hasError, isCheckOrRadio }) => css`
    position: relative;
    overflow: hidden;
    margin-bottom: ${getSpacing(3)};
    width: 100%;

    ${isCheckOrRadio &&
    css`
      width: fit-content;

      .main-container {
        display: flex;
        flex-direction: row-reverse;

        label {
          margin-left: ${getSpacing(1)};
        }
      }
    `}

    input,
    textarea {
      width: 100%;
      margin: 0;
      text-indent: 0;
      background-color: transparent;
      color: var(--turquoise);
      border: 1px solid var(--turquoise);
      resize: none;
      border-radius: 0;
      font-family: inherit;

      &::placeholder {
        color: var(--dirty-turquoise);
        font-family: RobotoMono;
      }

      ${isDirty &&
      css`
        border-color: var(--yellow);
      `}

      ${hasError &&
      css`
        border-color: var(--red);
      `}
    }

    textarea {
      padding: ${getSpacing(2)};
    }

    input {
      padding: ${getSpacing(1.5)} ${getSpacing(2)};

      ${withExtraicons &&
      css`
        padding-right: ${getSpacing(6)};
      `}
    }

    label {
      display: block;
      color: var(--white);
      padding-bottom: ${getSpacing(1)};

      ${hasError &&
      css`
        color: var(--red);
      `}
    }

    .input-container {
      position: relative;
    }

    .extra-icons {
      bottom: 0;
      right: 2px;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--dark-blue);
      padding: ${getSpacing(1)};

      ${type === "text" &&
      css`
        top: 50%;
        transform: translateY(-50%);
      `}

      ${type === "textarea" &&
      css`
        bottom: 5px;
      `}

      img {
        cursor: pointer;
        width: ${getSpacing(3)};
        height: ${getSpacing(3)};
        transition: 0.2s;

        &:not(:first-child) {
          margin-left: ${getSpacing(1)};
        }

        &:hover {
          opacity: 0.7;
        }

        &:active {
          opacity: 0.4;
        }
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
