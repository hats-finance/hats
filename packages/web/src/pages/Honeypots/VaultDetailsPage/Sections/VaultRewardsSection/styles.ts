import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledRewardsSection = styled.div`
  .rewards-containers {
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    gap: ${getSpacing(1.5)};

    .amounts {
      display: grid;
      grid-template-columns: 1fr;
      gap: ${getSpacing(1.5)};
    }

    .card {
      border: 1px solid var(--primary-light);
      padding: ${getSpacing(4)};
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: ${getSpacing(1)};
      width: 100%;
      height: 100%;

      &.bigPadding {
        padding: ${getSpacing(5)} ${getSpacing(8)};
      }

      h4.title {
        color: var(--grey-400);
      }

      h4.value {
        font-size: var(--medium);
      }

      .chart-container {
        margin-top: ${getSpacing(4)};
        width: 70%;
      }
    }
  }
`;
