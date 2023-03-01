import { getSpacing } from "styles";
import styled from "styled-components";

export const StyledSetupReview = styled.div`
  .next-step {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    color: var(--white);
    font-weight: 700;
    margin-bottom: ${getSpacing(1)};
  }
`;
