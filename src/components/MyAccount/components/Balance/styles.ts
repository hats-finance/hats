import styled from "styled-components";
import { breakpointsDefinition } from "./../../../../styles/breakpoints.styles";

export const StyledBalance = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--blue-3);
  padding: 15px;

  .title {
    font-weight: bold;
  }

  .value {
    margin: 15px 0;
    color: var(--turquoise);
    font-weight: bold;
    font-size: var(--medium);

    @media (max-width: ${breakpointsDefinition.mobile}) {
      font-size: var(--moderate);
    }
  }
`;
