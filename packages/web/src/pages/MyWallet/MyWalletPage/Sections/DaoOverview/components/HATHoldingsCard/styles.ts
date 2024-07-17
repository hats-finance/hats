import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledHATHoldingsCard = styled.div`
  padding: ${getSpacing(5)} ${getSpacing(6)};
  background: var(--background-clear-blue-2);
  width: fit-content;
  margin-top: ${getSpacing(4)};

  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .main-content {
      font-size: var(--medium);
      font-weight: 700;
    }

    .subtitle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: ${getSpacing(1)};
      font-size: var(--small);
    }
  }
`;
