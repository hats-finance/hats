import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledPayoutAllocation = styled.div`
  .result-divider {
    display: flex;
    align-items: center;
    gap: ${getSpacing(2)};
    margin: ${getSpacing(1)} 0 ${getSpacing(3)};

    div {
      flex: 1;
      height: 1px;
      border: 1px solid var(--grey-500);
      border-style: dashed;
    }
  }

  .result-container {
    display: flex;
    gap: ${getSpacing(3)};
    margin: ${getSpacing(1)} 0 ${getSpacing(2)};
  }
`;
