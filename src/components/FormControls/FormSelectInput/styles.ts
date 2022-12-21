import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledFormSelectInput = styled.div<{ hasError: boolean }>(
  ({ hasError }) => css`
    width: 100%;
    position: relative;
    margin-bottom: ${getSpacing(3)};

    label.input-label {
      display: block;
      color: var(--white);
      padding-bottom: ${getSpacing(1)};

      ${hasError &&
      css`
        color: var(--red);
      `}
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

export const SelectButton = styled.button<{ isDirty: boolean; hasError: boolean; isOpen: boolean }>(
  ({ isDirty, isOpen, hasError }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    text-align: left;
    padding: ${getSpacing(1.1)} ${getSpacing(2)};

    ${isDirty &&
    css`
      border: 1px solid var(--yellow);
    `}

    ${hasError &&
    css`
      border-color: var(--red);
    `}

    .text {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex-basis: 100%;
      font-size: var(--xsmall);
    }

    .icon {
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.2s;

      ${isOpen &&
      css`
        transform: rotateX(180deg);
      `}
    }
  `
);

export const SelectMenuOptions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  top: calc(100% + ${getSpacing(1)});
  z-index: 2;
  background-color: var(--dark-blue);
`;
