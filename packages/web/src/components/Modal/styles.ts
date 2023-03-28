import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledModal = styled.div<{ isShowing: boolean; zIndex: number; removeAnimation: boolean }>(
  ({ isShowing, zIndex, removeAnimation }) => css`
    position: fixed;
    z-index: ${1040 + zIndex};
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: ${removeAnimation ? "0" : "150ms"};

    ${isShowing &&
    css`
      opacity: 1;
      visibility: visible;
    `}

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--black);
      opacity: 0.5;
    }
  `
);

export const ModalContainer = styled.div<{
  withTitleDivider: boolean;
  removeHorizontalPadding: boolean;
  removeTopPadding: boolean;
  capitalizeTitle: boolean;
  withIcon: boolean;
  disableClose: boolean;
  overflowVisible: boolean;
  pgpKeystoreStyles: boolean;
}>(
  ({
    withTitleDivider,
    removeHorizontalPadding,
    capitalizeTitle,
    withIcon,
    disableClose,
    removeTopPadding,
    overflowVisible,
    pgpKeystoreStyles,
  }) => css`
    position: relative;
    max-width: calc(100vw - ${getSpacing(6)});
    max-height: calc(100vh - ${getSpacing(6)});
    overflow: ${overflowVisible ? "visible" : "auto"};
    background: ${pgpKeystoreStyles ? "var(--background-clearer-blue)" : "var(--field-blue)"};
    border: ${pgpKeystoreStyles ? "1px solid var(--turquoise)" : "none"};

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      max-width: unset;
      width: calc(100vw - ${getSpacing(2)});
      max-height: calc(100vh - ${getSpacing(2)});
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${getSpacing(1)} ${getSpacing(4)};

      ${withIcon &&
      css`
        padding: ${getSpacing(2)} ${getSpacing(4)} ${getSpacing(1)};
      `}

      ${withTitleDivider &&
      css`
        border-bottom: 1px solid var(--turquoise);
      `}
        
      ${disableClose &&
      css`
        padding: ${getSpacing(2.5)} ${getSpacing(4)};
      `}

      .title {
        display: flex;
        align-items: center;
        color: var(--white);
        font-size: var(--small);
        font-weight: 700;

        ${capitalizeTitle &&
        css`
          text-transform: uppercase;
        `}

        img {
          width: 50px;
          height: 50px;
          border-radius: 50px;
          margin-right: ${getSpacing(2)};
        }

        .back-button {
          cursor: pointer;
          padding-right: ${getSpacing(2)};

          span {
            margin-left: ${getSpacing(1)};
          }

          svg {
            transform: rotate(180deg);
            height: 15px;
            width: 15px;
          }
        }
      }

      .close {
        padding: 0;
        border: none;
        cursor: pointer;
        font-size: var(--medium-2);
        margin-left: ${getSpacing(10)};
        color: var(--white);
      }
    }

    .content {
      ${!removeHorizontalPadding &&
      css`
        padding: ${getSpacing(2)} ${getSpacing(4)} ${getSpacing(3)};
      `}

      ${removeTopPadding &&
      css`
        margin-top: -${getSpacing(5)};
      `}
    }
  `
);
