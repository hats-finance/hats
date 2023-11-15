import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledAllTimeLeaderboard = styled.div`
  .leaderboard-table {
    display: grid;
    grid-template-columns: repeat(5, auto);

    .header,
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: ${getSpacing(3)} ${getSpacing(1)};
      font-family: "IBM Plex Mono", monospace;
      text-align: center;
    }

    .content {
      border-top: 1px solid var(--primary-light);
      display: flex;
      align-items: center;
      gap: ${getSpacing(1)};

      &.prize {
        font-weight: 700;
      }

      &.streak {
        grid-column: 1 / 6;
        border-top: none;
        padding-top: 0;
      }

      .address {
        display: flex;
        align-items: center;
        gap: ${getSpacing(1)};

        &.profile {
          transition: 0.1s ease-in-out;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
            color: var(--secondary);
          }
        }
      }
    }
  }
`;
