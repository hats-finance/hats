import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "./../../styles/breakpoints.styles";

export const StyledSidebar = styled.nav<{ showFullScreen: boolean }>(
  ({ showFullScreen }) => css`
    height: 100%;
    padding-top: ${getSpacing(5)};
    display: flex;
    flex-direction: column;
    background-color: var(--background);
    border-right: 1px solid var(--primary-light);
    z-index: 2;

    @media (max-width: ${breakpointsDefinition.mediumScreen}) {
      width: ${getSpacing(21)};
      text-align: center;
    }

    @media (max-width: ${breakpointsDefinition.mobile}) {
      width: 100%;
      transform: translateX(-110%);
      border: none;
      position: fixed;
      padding-top: ${getSpacing(15)};
      transition: transform 0.2s ease-in-out;

      ${showFullScreen &&
      css`
        transform: translateX(0%);
        display: flex;
      `}
    }

    @media ((min-width: ${breakpointsDefinition.mobile}) and (max-height: 800px)) {
      padding-top: ${getSpacing(2)};
    }

    .logo {
      display: flex;
      justify-content: center;
      align-self: center;
      margin-bottom: ${getSpacing(6)};

      svg {
        width: 75%;
      }

      @media ((min-width: ${breakpointsDefinition.mobile}) and (max-height: 800px)) {
        margin-bottom: ${getSpacing(2)};
      }

      @media (max-width: ${breakpointsDefinition.mobile}) {
        display: none;
      }
    }

    .bottom-wrapper {
      margin: auto;
      margin-bottom: ${getSpacing(6)};

      @media ((min-width: ${breakpointsDefinition.mobile}) and (max-height: 800px)) {
        margin-bottom: ${getSpacing(3)};
      }
    }
  `
);
