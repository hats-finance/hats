import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledCommitteeToolsPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${breakpointsDefinition.mobile}) {
    padding: $element-padding-mobile;
  }

  .committee-tools-content {
    max-width: var(--element-max-width);
    width: 100%;
  }

  .error-label {
    color: var(--red);
    margin: 5px 0px;
  }
`;
