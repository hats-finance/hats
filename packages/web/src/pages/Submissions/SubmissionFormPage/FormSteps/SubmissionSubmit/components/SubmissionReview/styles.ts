import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSubmissionReview = styled.div`
  display: flex;
  flex-direction: column;

  .row {
    display: flex;
    gap: ${getSpacing(2)};
  }

  .buttons {
    margin-top: ${getSpacing(2)};
    display: flex;
    gap: ${getSpacing(4)};
    justify-content: flex-end;
  }
`;
