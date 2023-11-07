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
    justify-content: space-evenly;

    .line {
      position: absolute;
      top: ${getSpacing(7)};
      left: 0;
      width: 100%;
      height: 1px;
      background: var(--primary-light);
    }

    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${getSpacing(1)};
      width: ${getSpacing(18)};

      &:hover {
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
