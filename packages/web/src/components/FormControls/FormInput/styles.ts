import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { FormInputType } from "./FormInput";

type StyledFormInputProps = {
  isDirty: boolean;
  hasError: boolean;
  noMargin?: boolean;
  isChecked?: boolean;
  noLabel?: boolean;
  withExtraicons?: boolean;
  withPrefixIcon?: boolean;
  isCheckOrRadio?: boolean;
  disabled?: boolean;
  type?: FormInputType;
};

export const StyledFormInput = styled.div<StyledFormInputProps>(
  ({ isDirty, type, withExtraicons, hasError, isCheckOrRadio, noMargin, withPrefixIcon, isChecked, noLabel, disabled }) => css`
    position: relative;
    overflow: hidden;
    margin-bottom: ${noMargin ? 0 : getSpacing(3)};
    width: 100%;

    .main-container {
      position: relative;
    }

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

    ${disabled &&
    !isCheckOrRadio &&
    css`
      .main-container::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--disabled-input);
        opacity: 0.4;
        z-index: 1;
        cursor: not-allowed;
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
      font-size: var(--xsmall);

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
        border-color: var(--error-red) !important;
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
      padding: ${getSpacing(noLabel ? 1.2 : 3.6)} ${getSpacing(noLabel ? 1.5 : 2)} ${getSpacing(1.2)};

      ${withExtraicons &&
      css`
        padding-right: ${getSpacing(6)};
      `}

      ${withPrefixIcon &&
      css`
        padding-left: ${getSpacing(5.5)};
      `}

      ${isCheckOrRadio &&
      css`
        display: none;
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
        z-index: 1;
      `}

      ${isCheckOrRadio &&
      css`
        display: flex;
        align-items: center;
        gap: ${getSpacing(1.5)};
        cursor: pointer;

        .checkbox-inner {
          position: relative;
          display: block;
          width: ${getSpacing(4.4)};
          height: ${getSpacing(2.4)};
          border-radius: 100px;
          background: var(--grey-500);

          ${isChecked &&
          css`
            background: var(--teal);
          `}

          .checkbox-switch {
            top: 50%;
            transform: translateY(-50%);
            position: absolute;
            height: ${getSpacing(1.8)};
            width: ${getSpacing(1.8)};
            background: var(--white);
            border-radius: 100px;
            left: 3px;
            transition: ease-in-out 0.2s;

            ${isChecked &&
            css`
              left: ${getSpacing(2.1)};
            `}
          }
        }
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

      ${(type === "text" || type === "password") &&
      css`
        top: 50%;
        transform: translateY(-50%);
      `}

      ${type === "textarea" &&
      css`
        bottom: 5px;
      `}

      img, .icon {
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

    span.helper {
      display: block;
      color: var(--turquoise);
      margin-top: ${getSpacing(0.5)};
      margin-left: ${getSpacing(1)};
      font-size: var(--xxsmall);
    }
  `
);
