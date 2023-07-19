import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

const navlinkStyles = ({ sub, hidden }) => css`
  padding: ${getSpacing(2)} ${getSpacing(4)} ${getSpacing(2)} ${getSpacing(2)};
  border-left: ${getSpacing(0.8)} solid transparent;
  margin: ${getSpacing(2)} 0px;
  color: var(--white);
  font-size: var(--xsmall);
  display: flex;
  align-items: center;
  gap: ${getSpacing(1.5)};
  cursor: pointer;

  @media (max-width: ${breakpointsDefinition.mediumScreen}) {
    border-left: none;
    border-bottom: ${getSpacing(0.4)} solid transparent;
    padding: ${getSpacing(1.5)} ${getSpacing(3)};
    ${!sub &&
    css`
      flex-direction: column;
    `}
  }

  @media ((min-width: ${breakpointsDefinition.mobile}) and (max-height: 800px)) {
    margin: ${getSpacing(0.5)} 0px;
  }

  p.normal {
    display: block;

    @media (max-width: ${breakpointsDefinition.mediumScreen}) {
      display: none;
    }
  }

  p.collapsed {
    display: none;

    @media (max-width: ${breakpointsDefinition.mediumScreen}) {
      display: block;
    }
  }

  svg {
    width: ${getSpacing(3.5)};
    height: ${getSpacing(3.5)};
    object-fit: contain;
  }

  &.active {
    border-color: var(--secondary-light);
    background-color: var(--background-2);
    font-weight: bold;

    svg path {
      fill: var(--secondary-light);
    }
  }

  &.bounties.active {
    border-color: var(--secondary);

    svg path {
      fill: var(--secondary);
    }
  }

  &.audits.active {
    border-color: var(--primary-lighter);

    svg path {
      fill: var(--primary-lighter);
    }
  }

  &.vulnerability.active {
    border-color: var(--warning-yellow);

    svg path {
      fill: var(--warning-yellow);
    }
  }

  ${sub &&
  css`
    border-left-width: 0 !important;
    border-bottom-width: ${getSpacing(0.2)} !important;
    border-bottom-style: solid;
    margin: ${getSpacing(0)} 0px;
    padding: ${getSpacing(2)} ${getSpacing(3)};
    font-weight: normal !important;

    &:not(.active) {
      border-bottom-style: none;
    }
  `}

  ${hidden &&
  css`
    &:not(.active) {
      display: none;
    }
  `}

&.active {
    visibility: visible;
  }
`;

export const StyledNavLink = styled(NavLink)<{ sub?: boolean; hidden?: boolean }>(({ sub, hidden }) =>
  navlinkStyles({ sub, hidden })
);

export const StyledNavLinkNoRouter = styled.div<{ sub?: boolean; hidden?: boolean }>(({ sub, hidden }) =>
  navlinkStyles({ sub, hidden })
);

export const StyledNavLinksList = styled.div`
  .committee-tools {
    position: relative;

    .committee-tools-subroutes {
      position: absolute;
      top: 0;
      right: -100%;
      transform: translateX(-10%);
      background: var(--background);
      border: 1px solid var(--primary-light);

      @media (max-width: ${breakpointsDefinition.mediumScreen}) {
        right: -140%;
      }

      @media (max-width: ${breakpointsDefinition.mobile}) {
        right: 50%;
        transform: translateX(50%);
        top: 110%;
      }
    }
  }
`;
