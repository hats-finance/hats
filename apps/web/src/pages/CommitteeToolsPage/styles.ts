import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";
import { getSpacing } from "styles";

export const StyledCommitteeToolsPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${breakpointsDefinition.mobile}) {
    padding: 0 ${getSpacing(3)};
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
