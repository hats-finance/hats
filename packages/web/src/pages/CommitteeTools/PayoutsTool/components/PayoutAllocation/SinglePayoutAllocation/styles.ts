import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledSinglePayoutAllocation = styled.div`
  .result-divider {
    display: flex;
    align-items: center;
    gap: ${getSpacing(2)};
    margin: ${getSpacing(1)} 0 ${getSpacing(3)};

    div {
      flex: 1;
      height: 1px;
      border: 1px solid var(--grey-500);
      border-style: dashed;
    }
  }

  .result-container {
    display: flex;
    gap: ${getSpacing(3)};
    margin: ${getSpacing(1)} 0 ${getSpacing(2)};

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      flex-direction: column;
    }
  }

  .allocations {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(1.5)};
    border-top: 1px solid var(--grey-600);
    border-bottom: 1px solid var(--grey-600);
    padding: ${getSpacing(2)} ${getSpacing(1)};
    margin-top: ${getSpacing(4)};

    .allocation {
      display: flex;
      justify-content: space-between;

      @media (max-width: ${breakpointsDefinition.smallMobile}) {
        flex-direction: column;
        gap: ${getSpacing(1)};
      }

      .name {
        display: flex;
        align-items: center;
        gap: ${getSpacing(0.5)};
      }

      .values {
        display: flex;
        gap: ${getSpacing(1.5)};

        .percentage,
        .sum {
          padding: ${getSpacing(1.2)} ${getSpacing(2)};
          border: 1px solid var(--grey-600);
        }

        .sum {
          border-color: var(--teal);
        }
      }
    }
  }
`;
