import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledFormSelectInput = styled.div<{ noMargin: boolean }>(
  ({ noMargin }) => css`
    position: relative;
    margin-bottom: ${noMargin ? 0 : getSpacing(3)};
    width: 100%;

    label.input-label {
      display: block;
      color: var(--grey-400);
      font-size: var(--xxsmall);
      position: absolute;
      top: 10px;
      left: 17px;
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

export const SelectButton = styled.div<{
  isDirty: boolean;
  hasError: boolean;
  isOpen: boolean;
  isFilled: boolean;
  disabled: boolean;
  readOnly: boolean;
  noLabel: boolean;
}>(
  ({ isDirty, isOpen, hasError, isFilled, disabled, readOnly, noLabel }) => css`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    text-align: left;
    padding: ${getSpacing(3.4)} ${getSpacing(2)} ${getSpacing(0.8)};
    border: 1px solid var(--grey-500);
    font-size: var(--xsmall);

    ${noLabel &&
    css`
      padding: ${getSpacing(1.5)} ${getSpacing(1.5)} ${getSpacing(1.5)};
    `}

    &:hover {
      opacity: 1;
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

    ${readOnly &&
    css`
      cursor: not-allowed;
    `}

    ${isDirty &&
    css`
      border: 1px solid var(--yellow);
    `}

    ${isOpen &&
    css`
      border-color: var(--turquoise);
    `}

    ${hasError &&
    css`
      border-color: var(--error-red);
    `}

    .text {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex-basis: 100%;
      color: ${isFilled ? "var(--white)" : "var(--grey-500)"};
      text-transform: capitalize;
    }

    .icon {
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.2s;
      transform: ${noLabel ? "translateY(0)" : "translateY(-40%)"};
      color: ${readOnly ? "transparent" : "unherit"};

      ${isOpen &&
      css`
        transform: ${noLabel ? "translateY(0) rotateX(180deg)" : "translateY(-40%) rotateX(180deg)"};
      `}
    }
  `
);

export const SelectMenuOptions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  border: 1px solid var(--turquoise);
  top: calc(100% + ${getSpacing(1)});
  z-index: 2;
  background-color: var(--dark-blue);
  max-height: ${getSpacing(39)};
  overflow: auto;
`;
