import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledContractCoveredForm = styled.div`
  background: var(--background-clearer-blue);
  border-radius: 4px;
  padding: ${getSpacing(2.5)};

  &:not(:last-of-type) {
    padding-bottom: ${getSpacing(3)};
    margin-bottom: ${getSpacing(3)};
  }

  .contract {
    width: 100%;

    .subcontent {
      display: flex;
      justify-content: space-between;
      gap: ${getSpacing(3)};
    }
  }
`;
