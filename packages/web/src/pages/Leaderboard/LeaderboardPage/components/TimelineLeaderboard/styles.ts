import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledTimelineLeaderboard = styled.div`
  display: flex;
  gap: ${getSpacing(2)};

  .timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(12)};

    &-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${getSpacing(0.6)};
      width: ${getSpacing(18)};
      transition: 0.2s;

      &:hover,
      &.selected {
        cursor: pointer;

        img {
          background: var(--background);
          border: 2px solid var(--primary);
          padding: ${getSpacing(0.5)};
        }

        p.name {
          color: var(--primary);
        }
      }

      &.selected img {
        width: ${getSpacing(10)};
        height: ${getSpacing(10)};
        padding: ${getSpacing(1)};
      }

      p.date {
        background: var(--background);
        font-size: var(--xxsmall);
      }

      img {
        width: ${getSpacing(5)};
        height: ${getSpacing(5)};
        object-fit: contain;
        border-radius: 100px;
        border: 1px solid transparent;
      }

      p.name {
        font-size: var(--xsmall);
        font-weight: 700;
        text-align: center;
        background: var(--background);
      }
    }

    .control {
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${getSpacing(4.4)};
      height: ${getSpacing(4.4)};
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

      &.prev {
        transform: translate(${getSpacing(6.8)}, ${getSpacing(5)});
      }

      &.next {
        transform: translate(${getSpacing(6.8)}, ${getSpacing(-5)});
      }
    }

    .line {
      position: absolute;
      top: ${getSpacing(8)};
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: calc(100% - ${getSpacing(16)});
      background: var(--primary);
    }
  }

  .results {
    flex: 1;

    .vaultInfo {
      border-bottom: 2px solid var(--primary-light);
      padding-bottom: ${getSpacing(2)};
    }
  }
`;
