import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledLeaderboardPage = styled.div`
  h2.subtitle {
    display: flex;
    align-items: center;
    gap: ${getSpacing(2)};
  }

  .sections-handler {
    display: flex;
    margin-top: ${getSpacing(6)};

    .section {
      border-bottom: 1px solid var(--primary-light);
      padding: ${getSpacing(1.8)} ${getSpacing(14)};
      font-size: var(--small);
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        border-bottom: 1px solid var(--primary);
        background: var(--background-2);
      }

      &.selected {
        border-bottom: 1px solid var(--primary);
      }
    }
  }

  .leaderboard-container {
    width: 100%;
    margin-top: ${getSpacing(5)};
    margin-bottom: ${getSpacing(8)};
  }
`;
