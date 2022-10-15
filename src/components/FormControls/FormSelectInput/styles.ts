import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledFormSelectInput = styled.div`
  width: 100%;
  position: relative;
`;

export const SelectButton = styled.button<{ isChanged: boolean; isOpen: boolean }>(
  ({ isChanged, isOpen }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    text-align: left;
    padding: ${getSpacing(1)} ${getSpacing(2)};
    margin-bottom: ${getSpacing(3)};

    ${isChanged &&
    css`
      border: 1px solid var(--yellow);
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
  position: absolute;
  z-index: 2;
  background-color: var(--dark-blue);
  left: 0px;
  right: 0px;
  top: 48px;
`;
