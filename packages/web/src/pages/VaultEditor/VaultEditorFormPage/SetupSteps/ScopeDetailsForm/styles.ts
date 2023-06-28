import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledScopeDetailsForm = styled.div`
  .bold {
    font-weight: 700;
  }

  .code-langs {
    display: flex;
    align-items: center;
    gap: ${getSpacing(1)};
  }
`;
