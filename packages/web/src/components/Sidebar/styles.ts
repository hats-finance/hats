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
      display: none;
      border: none;
      position: fixed;
      padding-top: ${getSpacing(11)};

      ${showFullScreen &&
      css`
        display: flex;
        width: 100%;
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
