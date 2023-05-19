import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSubmissionProcessed = styled.div`
  .submission-status {
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(4)};
    margin: ${getSpacing(4)} 0;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: ${getSpacing(2)};

      p {
        width: 40%;
      }

      .status {
        width: 60%;
        display: flex;
        align-items: baseline;
        gap: ${getSpacing(0.6)};
      }
    }
  }

  .audit-button {
    color: var(--turquoise);
  }

  .buttons {
    margin-top: ${getSpacing(3)};
    display: flex;
    justify-content: space-around;
    gap: ${getSpacing(2)};
  }

  .bold {
    font-weight: bold;
  }
`;
