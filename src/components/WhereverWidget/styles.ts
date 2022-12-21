import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledWhereverWidgetContainer = styled.div`
  min-height: var(--header-button-hight);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;

  @media (max-width: ${breakpointsDefinition.mobile}) {
    margin-left: auto;
  }
`;

export const StyledWhereverWidget = styled.div`
  color: var(--white);
  background-color: var(--blue);
  min-height: var(--header-button-hight);
  border: none;
  height: 56px;
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:active {
    background-color: var(--light-blue);
    opacity: 1;
  }

  @media (max-width: ${breakpointsDefinition.mobile}) {
    margin-left: auto;
  }
`;
