import styled, { css } from "styled-components";
import { getSpacing } from "styles";

type StyledDropdownSelectorProps = {
  show: boolean;
  isOutsideScreen: boolean;
};

export const StyledDropdownSelector = styled.div<StyledDropdownSelectorProps>(
  ({ show, isOutsideScreen }) => css`
    ${!show &&
    css`
      display: none;
      z-index: 100;
    `}

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: transparent;
    }

    .options {
      position: absolute;
      z-index: 100;
      top: calc(100% + ${getSpacing(1)});
      right: ${isOutsideScreen ? "unset" : 0};
      left: ${isOutsideScreen ? "0" : "unset"};
      background-color: var(--background);
      width: max-content;
      border-radius: 2px;
      border: 1px solid var(--primary);

      .option {
        padding: ${getSpacing(1.5)} ${getSpacing(2)};
        border-radius: 2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: ${getSpacing(1.5)};

        &:hover {
          background-color: var(--background-2);
        }

        &:active {
          opacity: 0.7;
        }

        span {
          color: var(--white);
        }

        img {
          width: 20px;
        }
      }
    }
  `
);
