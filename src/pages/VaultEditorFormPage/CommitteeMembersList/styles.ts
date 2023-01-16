import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledCommitteeMembersList = styled.div`
  .helper-text {
    color: var(--white);
    margin-bottom: ${getSpacing(5)};

    ul {
      padding-left: ${getSpacing(3)};
    }
  }
`;
