import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledPointsOverview = styled.div`
  margin-top: ${getSpacing(4)};

  .cards {
    margin-top: ${getSpacing(2)};
    display: grid;
    grid-template-columns: 3fr 3fr 3fr 4fr;

    .overview-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${getSpacing(5)} ${getSpacing(4)} ${getSpacing(1)};

      &:not(:last-child) {
        border-right: 1px solid var(--primary);
      }

      p {
        text-align: center;

        &.main-content {
          font-size: var(--moderate-big);
          font-weight: 700;
          font-family: "IBM Plex Mono", monospace;
        }
      }

      .action-button {
        margin-top: ${getSpacing(5)};
        width: 100%;
      }

      .flex {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: ${getSpacing(1)};
      }
    }
  }
`;
