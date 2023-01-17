import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { FormInputType } from "./FormInput";

type StyledFormInputProps = {
  isDirty: boolean;
  hasError: boolean;
  noMargin?: boolean;
  withExtraicons?: boolean;
  withPrefixIcon?: boolean;
  isCheckOrRadio?: boolean;
  type?: FormInputType;
};

export const StyledFormInput = styled.div<StyledFormInputProps>(
  ({ isDirty, type, withExtraicons, hasError, isCheckOrRadio, noMargin, withPrefixIcon }) => css`
    position: relative;
    overflow: hidden;
    margin-bottom: ${noMargin ? 0 : getSpacing(3)};
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
      color: var(--white);
      border: 1px solid var(--grey-500);
      resize: none;
      border-radius: 0;
      font-family: inherit;
      color-scheme: dark;

      &::placeholder {
        color: var(--grey-500);
        font-family: RobotoMono;
      }

      &:focus {
        border-color: var(--turquoise);
      }

      ${isDirty &&
      css`
        border-color: var(--warning-yellow);
      `}

      ${hasError &&
      css`
        border-color: var(--error-red);
      `}

      ${isCheckOrRadio &&
      css`
        width: ${getSpacing(2.5)};
        height: ${getSpacing(2.5)};
      `}
    }

    textarea {
      padding: ${getSpacing(3.8)} ${getSpacing(2)} ${getSpacing(2)} ${getSpacing(2)};
    }

    input {
      padding: ${getSpacing(3.6)} ${getSpacing(2)} ${getSpacing(1.2)};

      ${withExtraicons &&
      css`
        padding-right: ${getSpacing(6)};
      `}

      ${withPrefixIcon &&
      css`
        padding-left: ${getSpacing(5.5)};
      `}
    }

    label {
      display: block;
      color: var(--grey-400);
      padding-bottom: ${getSpacing(1)};

      ${!isCheckOrRadio &&
      css`
        font-size: var(--xxsmall);
        position: absolute;
        top: 10px;
        left: ${withPrefixIcon ? "45px" : "17px"};
      `}
    }

    .input-container {
      position: relative;

      .prefix-icon {
        position: absolute;
        top: 50%;
        transform: translate(14px, -50%);
      }
    }

    .extra-icons {
      bottom: 0;
      right: 2px;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
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
      color: var(--error-red);
      margin-top: ${getSpacing(0.5)};
      margin-left: ${getSpacing(1)};
      font-size: var(--xxsmall);
    }
  `
);
