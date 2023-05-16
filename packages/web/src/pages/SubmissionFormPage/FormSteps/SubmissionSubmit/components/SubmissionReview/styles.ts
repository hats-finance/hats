import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSubmissionReview = styled.div`
  display: flex;
  flex-direction: column;

  .row {
    display: flex;
    gap: ${getSpacing(2)};
  }
`;
