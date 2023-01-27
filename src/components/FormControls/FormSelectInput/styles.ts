import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledFormSelectInput = styled.div<{ hasError: boolean }>(
  ({ hasError }) => css`
    width: 100%;
    position: relative;
    margin-bottom: ${getSpacing(3)};

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
}>(
  ({ isDirty, isOpen, hasError, isFilled, disabled }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    text-align: left;
    padding: ${getSpacing(3.4)} ${getSpacing(2)} ${getSpacing(0.6)};
    border: 1px solid var(--grey-500);

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
        background-color: var(--grey-700);
        opacity: 0.4;
        z-index: 1;
        cursor: not-allowed;
      }
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
    }

    .icon {
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.2s;
      filter: grayscale(1);
      transform: translateY(-40%);

      ${isOpen &&
      css`
        transform: translateY(-40%) rotateX(180deg);
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
`;
