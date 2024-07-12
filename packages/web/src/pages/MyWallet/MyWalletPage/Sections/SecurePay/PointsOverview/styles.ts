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
      padding: ${getSpacing(8)} ${getSpacing(4)} ${getSpacing(1)};
      position: relative;

      &:not(:last-child) {
        border-right: 1px solid var(--primary-light);
      }

      p {
        text-align: center;

        &.main-content {
          font-size: var(--moderate-big);
          font-weight: 700;
          font-family: "IBM Plex Mono", monospace;
        }

        &.convertible-points {
          font-family: "IBM Plex Mono", monospace;
          font-size: var(--moderate);
          font-weight: 400;

          strong {
            font-family: "IBM Plex Mono", monospace;
            font-weight: 700;
          }
        }
      }

      .action-button {
        width: 100%;
        flex: 1;
      }

      .flex {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: ${getSpacing(1)};
      }

      .convertible-buttons {
        width: 100%;
        display: flex;
        align-items: center;
        gap: ${getSpacing(1)};
      }

      .pointvalue-month-selector {
        position: absolute;
        top: 0;
        right: ${getSpacing(3)};
        width: 50%;
        margin-bottom: ${getSpacing(2)};
      }
    }
  }
`;

export const StyledRedeemedHistoryModal = styled.div`
  width: 475px;
  color: var(--white);

  .logs {
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(1.5)};

    .log {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      align-items: center;
      gap: ${getSpacing(2)};

      &.head {
        font-family: "IBM Plex Mono", monospace;
        font-weight: 700;
        margin-bottom: ${getSpacing(2)};
      }
    }
  }
`;
