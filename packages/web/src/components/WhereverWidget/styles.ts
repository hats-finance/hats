import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledWhereverWidgetContainer = styled.div`
  min-height: var(--header-button-hight);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledWhereverWidget = styled.div`
  background-color: transparent;
  color: var(--white);
  border: 1px solid var(--primary);
  padding: ${getSpacing(0.5)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: ${breakpointsDefinition.mobile}) {
    margin-left: auto;
  }
`;
