import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";
import { getSpacing } from 'styles';

export const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  padding: ${getSpacing(3)} ${getSpacing(5)};
  display: flex;
  justify-content: space-between;
  background-color: var(--dark-blue);
  align-items: center;
  z-index: 3;

  @media (max-width: ${breakpointsDefinition.mobile}) {
    padding: 10px;
  }

  .page-title {
    font-size: var(--large);
    color: var(--white);
    margin-right: 20px;

    @media (max-width: ${breakpointsDefinition.smallScreen}) {
      font-size: var(--medium);
    }

    @media (max-width: ${breakpointsDefinition.mobile}) {
      display: none;
    }
  }

  .menu-button {
    margin-left: 10px;

    @media (min-width: ${breakpointsDefinition.mobile}) {
      display: none;
    }
  }
`;
