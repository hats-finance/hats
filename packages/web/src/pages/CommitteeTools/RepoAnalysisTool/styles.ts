import styled, { keyframes } from "styled-components";
import { getSpacing } from "styles";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const StyledRepoAnalysisPage = styled.div`
  padding: ${getSpacing(4)};

  .title-container {
    margin-bottom: ${getSpacing(4)};
    
    .title {
      display: flex;
      align-items: center;
      cursor: pointer;
      
      svg {
        margin-right: ${getSpacing(1)};
      }
      
      p {
        font-size: var(--medium);
        .bold {
          font-weight: 600;
        }
      }
    }
  }

  .content {
    .input-section {
      display: flex;
      gap: ${getSpacing(2)};
      align-items: flex-end;
      margin-bottom: ${getSpacing(4)};

      .analyze-button {
        height: 40px;
        margin-bottom: ${getSpacing(2)};
      }
    }

    .error-message {
      background: var(--error-light);
      color: var(--error);
      padding: ${getSpacing(2)};
      border-radius: 6px;
      margin-bottom: ${getSpacing(3)};
    }

    .analysis-results {
      .section {
        background: var(--background-2);
        border-radius: 8px;
        padding: ${getSpacing(3)};
        margin-bottom: ${getSpacing(3)};

        h3 {
          font-size: var(--medium);
          margin-bottom: ${getSpacing(2)};
          color: var(--white);
        }

        .estimation-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: ${getSpacing(2)};

          .estimation-item {
            background: var(--background-3);
            padding: ${getSpacing(2)};
            border-radius: 6px;
            text-align: center;

            .label {
              display: block;
              margin-bottom: ${getSpacing(1)};
              color: var(--grey-400);
            }

            .value {
              font-size: var(--medium);
              font-weight: 600;
              color: var(--primary);
            }

            &.shimmer {
              height: 80px;
              background: linear-gradient(
                90deg,
                var(--background-3) 25%,
                var(--background-2) 50%,
                var(--background-3) 75%
              );
              background-size: 200% 100%;
              animation: ${shimmer} 1.5s infinite;
            }
          }
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: ${getSpacing(2)};

          .summary-item {
            background: var(--background-3);
            padding: ${getSpacing(2)};
            border-radius: 6px;

            .label {
              display: block;
              margin-bottom: ${getSpacing(1)};
              color: var(--grey-400);
              font-size: var(--small);
            }

            .value {
              font-size: var(--medium);
              font-weight: 600;
              color: var(--white);
            }

            &.shimmer {
              height: 70px;
              background: linear-gradient(
                90deg,
                var(--background-3) 25%,
                var(--background-2) 50%,
                var(--background-3) 75%
              );
              background-size: 200% 100%;
              animation: ${shimmer} 1.5s infinite;
            }
          }
        }

        .capabilities-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: ${getSpacing(2)};

          .capability-item {
            background: var(--background-3);
            padding: ${getSpacing(2)};
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .label {
              color: var(--grey-400);
            }

            .value {
              font-weight: 600;
              
              &.positive {
                color: var(--success);
              }
              
              &.negative {
                color: var(--error);
              }
            }

            &.shimmer {
              height: 50px;
              background: linear-gradient(
                90deg,
                var(--background-3) 25%,
                var(--background-2) 50%,
                var(--background-3) 75%
              );
              background-size: 200% 100%;
              animation: ${shimmer} 1.5s infinite;
            }
          }
        }

        .deployable-contracts {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: ${getSpacing(2)};

          .contract-item {
            background: var(--background-3);
            padding: ${getSpacing(2)};
            border-radius: 6px;
            color: var(--white);
            font-family: monospace;

            &.shimmer {
              height: 40px;
              background: linear-gradient(
                90deg,
                var(--background-3) 25%,
                var(--background-2) 50%,
                var(--background-3) 75%
              );
              background-size: 200% 100%;
              animation: ${shimmer} 1.5s infinite;
            }
          }
        }
      }
    }
  }
`; 