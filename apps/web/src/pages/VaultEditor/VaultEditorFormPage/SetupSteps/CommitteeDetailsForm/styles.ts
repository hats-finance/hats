import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledCommitteeDetailsForm = styled.div`
  .half {
    width: 60%;

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      width: 100%;
    }
  }
`;
