import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { IHackerStreakProps } from "./HackerStreak";

export const StyledHackerStreak = styled.div<IHackerStreakProps>(
  ({ streak, maxStreak }) => css`
    width: 100%;
    position: relative;
    cursor: pointer;

    .track {
      width: 100%;
      height: ${getSpacing(2.2)};
      border: 1px solid var(--primary-light);
      border-radius: 100px;
    }

    .streak-track {
      position: absolute;
      top: 0;
      left: 0;
      width: ${(streak / maxStreak) * 100}%;
      height: ${getSpacing(2.2)};
      border-radius: 100px;
      background: linear-gradient(90.02deg, #24285f 0.02%, #87dbdb 94.08%);
      display: flex;
      justify-content: flex-end;
      align-items: center;

      p {
        font-weight: 700;
        font-style: italic;
        color: var(--black);
        letter-spacing: 2px;
        padding-right: ${getSpacing(1)};
      }

      .streak-value {
        display: flex;
        justify-content: center;
        align-items: center;
        width: ${getSpacing(4.5)};
        height: ${getSpacing(4.5)};
        border-radius: 100%;
        background: #87dbdb;
        border: 2px solid var(--background);
        color: var(--black);
        font-weight: 700;
        font-size: var(--small);
      }
    }
  `
);

export const StyledExplanationModal = styled.div`
  max-width: 400px;
  max-height: 80vh;

  .title {
    margin-top: ${getSpacing(3)};
    text-align: center;
    font-size: var(--medium);
  }

  .description {
  }

  .streak-example {
    width: 75%;
    margin: ${getSpacing(3)} auto;
  }

  .buttons {
    display: flex;
    justify-content: center;
    margin: ${getSpacing(6)} 0 ${getSpacing(3)};
  }
`;
