import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledHoldingsSection = styled.div`
  .holdings {
    .header,
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 3fr 160px;
      align-items: center;
      gap: ${getSpacing(1)};
      padding: ${getSpacing(0)} ${getSpacing(2)};

      .action-button {
        display: flex;
        justify-content: flex-end;
      }

      @media (max-width: ${breakpointsDefinition.smallScreen}) {
        grid-template-columns: 1fr 1fr 1fr;
        gap: ${getSpacing(3)};
        padding: ${getSpacing(0)} ${getSpacing(1)};

        .last {
          display: none;
        }

        .status {
          grid-column-start: 1;
          grid-column-end: 4;
          display: flex;
          justify-content: flex-start;
        }

        .action-button {
          justify-content: flex-start;
          grid-column-start: 1;
          grid-column-end: 4;
        }
      }
    }

    .header {
      font-weight: 700;
    }
  }

  .how-to-withdraw {
    margin-bottom: ${getSpacing(6)};

    .process-flow {
      display: flex;
      align-items: center;
      gap: ${getSpacing(2)};
      margin-top: ${getSpacing(3)};
      margin-bottom: ${getSpacing(5)};

      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: ${getSpacing(1)};

        p {
          color: var(--grey-400);
        }
      }
    }

    p.explanation {
      width: 80%;

      @media (max-width: ${breakpointsDefinition.smallMobile}) {
        width: 100%;
      }
    }
  }
`;
