import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledLeaderboardSection = styled.div<{ cols: number }>(
  ({ cols }) => css`
    padding-bottom: ${getSpacing(10)};

    .leaderboard-table {
      display: grid;
      grid-template-columns: repeat(${cols}, auto);
      overflow-x: auto;

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

    span.error {
      display: block;
      color: var(--error-red);
      margin-top: ${getSpacing(0.5)};
      margin-left: ${getSpacing(1)};
      font-size: var(--xxsmall);
    }
  `
);
