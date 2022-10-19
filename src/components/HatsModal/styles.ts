import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledModal = styled.div<{ isShowing: boolean }>(
  ({ isShowing }) => css`
    position: fixed;
    z-index: 1040;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: 150ms;

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
  capitalizeTitle: boolean;
  withIcon: boolean;
}>(
  ({ withTitleDivider, removeHorizontalPadding, capitalizeTitle, withIcon }) => css`
    position: relative;
    background: var(--field-blue);
    max-width: calc(100vw - ${getSpacing(6)});
    max-height: calc(100vh - ${getSpacing(6)});
    overflow: auto;

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
        padding: ${getSpacing(1.5)} ${getSpacing(4)};
      `}

      ${withTitleDivider &&
      css`
        border-bottom: 1px solid var(--turquoise);
      `}

      .title {
        display: flex;
        align-items: center;
        color: var(--white);
        font-size: var(--small);

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
      }

      .close {
        padding: 0;
        border: none;
        cursor: pointer;
        font-size: var(--medium-2);
        margin-left: ${getSpacing(10)};
      }
    }

    .content {
      ${!removeHorizontalPadding &&
      css`
        padding: ${getSpacing(2)} ${getSpacing(4)} ${getSpacing(3)};

        @media (max-width: ${breakpointsDefinition.smallMobile}) {
          padding: ${getSpacing(2)} ${getSpacing(2)} ${getSpacing(3)};
        }
      `}
    }
  `
);
