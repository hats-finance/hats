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
      flex-direction: column;
      gap: ${getSpacing(2.5)};

      .info {
        .header-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: ${getSpacing(1.5)};
          font-size: var(--xsmall);
          font-family: "IBM Plex Sans", sans-serif !important;
          font-weight: 500;
          font-size: var(--small);

          .title-container {
            .name {
              display: flex;
              align-items: center;
              gap: ${getSpacing(1)};

              .address {
                display: flex;
                align-items: center;
                gap: ${getSpacing(1)};
                color: var(--grey-400);
                font-size: var(--xsmall);
              }
            }

            .network {
              display: flex;
              align-items: center;
              gap: ${getSpacing(0.5)};
              font-size: var(--xsmall);
              color: var(--grey-400);

              img {
                width: ${getSpacing(2.5)};
                height: ${getSpacing(2.5)};
              }
            }
          }
          .pills {
            display: flex;
            gap: ${getSpacing(1)};
          }
        }
      }

      .status-amount {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: ${getSpacing(3)};

        .amount {
          display: flex;
          align-items: center;
          gap: ${getSpacing(1.5)};
          font-size: var(--moderate-big);
          font-weight: 700;
        }

        .red {
          color: var(--error-red);
        }
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
    display: flex;
    align-items: center;
    gap: ${getSpacing(1)};
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 0.7;
    }
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
          align-items: center;
          gap: ${getSpacing(0.5)};

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
