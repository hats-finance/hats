import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledNavLink = styled(NavLink)`
  padding: ${getSpacing(2)};
  border-left: ${getSpacing(0.8)} solid transparent;
  margin: ${getSpacing(1.5)} 0px;
  color: var(--white);
  font-size: var(--xsmall);

  @media (max-width: ${breakpointsDefinition.mobile}) {
    border-left: unset;
  }

  &.vulnerability {
    color: var(--bright-green);

    &.active {
      border-color: var(--bright-green);
      font-weight: bold;
      color: var(--bright-green);
    }
  }

  &.active {
    border-left-color: var(--turquoise);
    background-color: var(--blue);
    font-weight: bold;
  }

  &.hidden:not(.active) {
    display: none;
  }
`;
