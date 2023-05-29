import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledNavLink = styled(NavLink)`
  padding: ${getSpacing(2)} ${getSpacing(4)} ${getSpacing(2)} ${getSpacing(2)};
  border-left: ${getSpacing(0.8)} solid transparent;
  margin: ${getSpacing(2)} 0px;
  color: var(--white);
  font-size: var(--xsmall);
  display: flex;
  align-items: center;
  gap: ${getSpacing(1.5)};

  @media (max-width: ${breakpointsDefinition.smallScreen}) {
    flex-direction: column;
    border-left: none;
    border-bottom: ${getSpacing(0.4)} solid transparent;
    padding: ${getSpacing(1.5)} ${getSpacing(3)};
  }

  p.normal {
    display: block;

    @media (max-width: ${breakpointsDefinition.smallScreen}) {
      display: none;
    }
  }

  p.collapsed {
    display: none;

    @media (max-width: ${breakpointsDefinition.smallScreen}) {
      display: block;
    }
  }

  svg {
    width: ${getSpacing(3.5)};
    height: ${getSpacing(3.5)};
    object-fit: contain;
  }

  &.active {
    border-color: var(--primary-light);
    background-color: var(--background-2);
    font-weight: bold;

    svg path {
      fill: var(--primary-light);
    }
  }

  &.bounties.active {
    border-color: var(--secondary);

    svg path {
      fill: var(--secondary);
    }
  }

  &.audits.active {
    border-color: var(--primary);

    svg path {
      fill: var(--primary);
    }
  }

  &.vulnerability.active {
    border-color: var(--warning-yellow);

    svg path {
      fill: var(--warning-yellow);
    }
  }

  &.hidden:not(.active) {
    display: none;
  }
`;
