import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledFAQ = styled.div`
  margin-bottom: ${getSpacing(12)};
  width: 100%;
  max-width: 900px;

  ul {
    padding-left: ${getSpacing(3)};
    margin-top: ${getSpacing(1)};

    li {
      margin-bottom: ${getSpacing(0.5)};
    }
  }

  a {
    color: var(--secondary);
  }
`;
