import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledNavLink = styled(NavLink)`
  height: 50px;
  line-height: 50px;
  padding-left: 15px;
  border-left: 4px solid transparent;
  margin: 10px 0px;
  color: var(--dirty-turquoise);
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
    color: var(--turquoise);
    background-color: var(--blue);
    font-weight: bold;
  }

  &.hidden:not(.active) {
    display: none;
  }
`;
