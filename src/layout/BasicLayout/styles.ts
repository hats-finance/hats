import styled from 'styled-components';
import { getSpacing } from 'styles';
import { breakpointsDefinition } from 'styles/breakpoints.styles';

export const StyledApp = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const AppLayout = styled.div`
  display: flex;
  flex: 1;
  overflow: auto;
`;

export const AppContent = styled.section`
  padding: ${getSpacing(6)};

  @media only screen and (max-width: ${breakpointsDefinition.mobile}) {
    padding: ${getSpacing(4)} ${getSpacing(2)};
  }
`;

export const ContentWrapper = styled.section`
  flex: 1;
  overflow: auto;
`;
