import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledAidropCard = styled.div`
  margin-bottom: ${getSpacing(6)};
  display: flex;
  flex-direction: column;
  background: var(--background-clear-blue-2);
  padding: ${getSpacing(3.5)} ${getSpacing(4.5)};
  border-radius: ${getSpacing(1.5)};

  .preview {
    .section {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .info {
        .name {
          display: flex;
          align-items: center;
          gap: ${getSpacing(1.5)};
          font-size: var(--xsmall);
          font-family: "IBM Plex Sans", sans-serif !important;
          font-weight: 500;
        }
      }

      .amount {
        display: flex;
        align-items: center;
        gap: ${getSpacing(1.5)};
        font-size: var(--moderate-big);
        font-weight: 700;
      }
    }
  }

  .buttons {
    display: flex;
    gap: ${getSpacing(1.5)};
    margin-top: ${getSpacing(3)};
    align-self: flex-end;
  }
`;

export const StyledElegibilityBreakdown = styled.div`
  margin: 0 auto;
  width: 100%;
  margin-top: ${getSpacing(6)};

  div.title {
    border-bottom: 1px solid var(--grey-600);
    padding-bottom: ${getSpacing(1)};
    margin-bottom: ${getSpacing(1.5)};
  }

  .elegibility-breakdown {
    .breakdown {
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(1)};
      border-bottom: 1px solid var(--grey-600);
      padding-bottom: ${getSpacing(1.5)};

      &-item {
        display: flex;
        justify-content: space-between;

        .left {
          display: flex;

          .check {
            color: var(--grey-600);
            width: ${getSpacing(2.5)};
          }
        }

        &.eligible {
          .left .check {
            color: var(--secondary);
          }
        }

        &:not(.eligible) {
          color: var(--grey-600);
        }
      }
    }

    .total {
      padding-top: ${getSpacing(1.5)};
      display: flex;
      justify-content: space-between;
      font-weight: 700;
    }
  }
`;
