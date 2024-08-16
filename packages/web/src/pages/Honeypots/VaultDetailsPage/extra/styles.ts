import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledTermsAndConditions = styled.div`
  margin-bottom: ${getSpacing(4)};

  h2,
  h3,
  p {
    margin-bottom: ${getSpacing(2.5)};
  }

  .main-title {
    margin-bottom: ${getSpacing(4)};
  }
`;
