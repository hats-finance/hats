import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "./../../styles/breakpoints.styles";

export const StyledSidebar = styled.nav<{ showFullScreen: boolean }>(
  ({ showFullScreen }) => css`
    width: var(--sidebar-width);
    height: 100%;
    padding-top: ${getSpacing(5)};
    display: flex;
    flex-direction: column;
    background-color: var(--background);
    border-right: 1px solid var(--primary-light);
    z-index: 2;

    @media (max-width: ${breakpointsDefinition.mobile}) {
      width: 100%;
      transform: translateX(-110%);
      border: none;
      position: fixed;
      padding-top: ${getSpacing(11)};
      transition: transform 0.2s ease-in-out;

      ${showFullScreen &&
      css`
        transform: translateX(0%);
        display: flex;
      `}
    }

    .logo {
      align-self: center;
      margin-bottom: ${getSpacing(6)};

      @media (max-width: ${breakpointsDefinition.mobile}) {
        display: none;
      }
    }

    .bottom-wrapper {
      margin: auto;
      margin-bottom: 80px;
    }
  `
);
