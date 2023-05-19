import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledNavLink = styled(NavLink)`
  padding: ${getSpacing(1.6)} ${getSpacing(2)};
  border-left: ${getSpacing(0.8)} solid transparent;
  margin: ${getSpacing(2)} 0px;
  color: var(--white);
  font-size: var(--xsmall);

  @media (max-width: ${breakpointsDefinition.mobile}) {
    border-left: unset;
  }

  &.active {
    border-left-color: var(--secondary);
    background-color: var(--background-1);
    font-weight: bold;
  }

  &.audits.active {
    border-color: var(--primary);
  }

  &.vulnerability.active {
    border-color: var(--warning-yellow);
  }

  &.hidden:not(.active) {
    display: none;
  }
`;
