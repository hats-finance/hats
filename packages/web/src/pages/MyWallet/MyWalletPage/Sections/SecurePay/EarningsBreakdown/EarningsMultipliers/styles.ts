import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledEarningsMultipliers = styled.div`
  margin-top: ${getSpacing(4)};

  h3 {
    margin-bottom: ${getSpacing(2)};
  }

  .multipliers {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: ${getSpacing(4)};

    .multiplier {
      background: var(--background-clear-blue);
      padding: ${getSpacing(5)} ${getSpacing(3)};
      display: flex;
      flex-direction: column;

      .value {
        font-size: var(--xxxlarge);
        margin-bottom: ${getSpacing(3)};
      }

      .info {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        gap: ${getSpacing(4)};

        .name {
          font-size: var(--moderate);
          font-weight: 700;
        }
      }
    }
  }
`;
