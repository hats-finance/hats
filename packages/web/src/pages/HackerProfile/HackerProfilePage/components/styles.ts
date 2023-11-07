import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledHackerActivity = styled.div`
  margin-top: ${getSpacing(10)};

  h3 {
    font-size: var(--medium);
    margin-bottom: ${getSpacing(3)};
  }

  .activity-timeline {
    position: relative;
    display: flex;
    gap: ${getSpacing(2)};
    justify-content: space-between;
    width: calc(100% - ${getSpacing(6)});
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

      &:hover {
      }
    }

    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${getSpacing(1)};
      width: ${getSpacing(18)};

      &:hover,
      &.selected {
        cursor: pointer;

        img {
          border: 1px solid var(--primary);
          background: var(--background);
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
        transition: 0.2s;
      }

      p.name {
        font-weight: 700;
        text-align: center;
      }
    }
  }
`;
