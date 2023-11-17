import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledHackerActivity = styled.div`
  margin-top: ${getSpacing(10)};

  h3.subtitle {
    font-size: var(--medium);
    font-weight: 500;
    margin-bottom: ${getSpacing(3)};
  }

  .activity-timeline {
    position: relative;
    display: flex;
    gap: ${getSpacing(2)};
    justify-content: space-between;
    width: 100%;
    margin: 0 auto;

    .line {
      position: absolute;
      top: ${getSpacing(7)};
      left: 0;
      width: 100%;
      height: 1px;
      background: var(--primary-light);
    }

    .control {
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${getSpacing(4.4)};
      height: ${getSpacing(4.4)};
      transform: translateY(${getSpacing(5)});
      border-radius: 100px;
      border: 1px solid var(--primary);
      background: var(--background);
      cursor: pointer;
      align-self: flex-start;

      &.disabled {
        border-color: var(--grey-800);
        color: var(--grey-800);
        cursor: default;
      }
    }

    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${getSpacing(1)};
      width: ${getSpacing(18)};
      transition: 0.2s;

      &:hover,
      &.selected {
        cursor: pointer;

        img {
          border: 1px solid var(--primary);
          background: var(--background);
        }

        p.name {
          color: var(--primary);
        }
      }

      p.date {
        font-size: var(--xxsmall);
      }

      img {
        width: ${getSpacing(8)};
        height: ${getSpacing(8)};
        object-fit: contain;
        border-radius: 100px;
        padding: ${getSpacing(1)};
        border: 1px solid transparent;
      }

      p.name {
        font-weight: 700;
        text-align: center;
      }
    }
  }

  .payout-details {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: ${getSpacing(6)};
      border-bottom: 1px solid var(--primary);
      padding: 0 ${getSpacing(1)};
      padding-bottom: ${getSpacing(2)};

      h2 {
        font-size: var(--medium);
        line-height: 24px;
      }

      p.type {
        font-size: var(--xsmall);
        font-weight: 700;
        font-style: italic;
        margin-bottom: ${getSpacing(0.5)};
      }

      .prize {
        display: flex;
        flex-direction: column;
        align-items: center;

        h3 {
          font-size: var(--moderate-big);
        }
      }
    }

    .review {
      display: flex;
      flex-wrap: wrap;
      gap: ${getSpacing(2)};
      margin-top: ${getSpacing(3)};
      padding: 0 ${getSpacing(1)};

      .findings {
        display: flex;
        gap: ${getSpacing(3)};

        .finding-stats {
          display: flex;
          align-items: center;
          gap: ${getSpacing(1)};
        }
      }
    }

    .submissions {
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(3)};
      margin-top: ${getSpacing(3)};
      padding: 0 ${getSpacing(1)};
    }
  }
`;
