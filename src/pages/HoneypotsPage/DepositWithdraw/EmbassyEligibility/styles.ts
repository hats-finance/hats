import { getSpacing } from "styles";
import styled from "styled-components";

export const StyledEmbassyEligibility = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--white);
  margin-top: ${getSpacing(3)};

  .title {
    background-color: var(--blue-3);
    padding: ${getSpacing(2)};
    width: fit-content;
  }

  .content {
    border: 1px solid var(--blue-3);
    padding: ${getSpacing(2)};
  }
`;
