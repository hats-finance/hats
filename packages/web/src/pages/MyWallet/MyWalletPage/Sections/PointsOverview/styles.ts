import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledPointsOverview = styled.div`
  margin-top: ${getSpacing(4)};

  .cards {
    margin-top: ${getSpacing(2)};
    display: grid;
    grid-template-columns: 2fr 2fr 2fr 3fr;

    .overview-card {
      padding: ${getSpacing(5)} ${getSpacing(4)};

      &:not(:last-child) {
        border-right: 1px solid var(--primary);
      }
    }
  }
`;
