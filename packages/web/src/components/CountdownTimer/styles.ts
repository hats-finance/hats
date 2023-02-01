import styled, { css } from "styled-components";

type StyledCountdownTimerProps = {
  color: "yellow" | "blue";
  plainTextView: boolean;
};

export const StyledCountdownTimer = styled.div<StyledCountdownTimerProps>(
  ({ color, plainTextView }) => css`
    display: flex;
    color: var(--turquoise);
    margin-top: 10px;

    .time-element {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--light-blue);
      font-weight: bold;
      margin: 0 8px;
      padding: 6px;
      width: 50px;
      height: 55px;

      ${color === "yellow" &&
      css`
        color: var(--yellow);
      `}

      ${color === "blue" &&
      css`
        color: var(--turquoise);
      `}

      .value {
        font-size: var(--moderate);
      }

      .type {
        font-size: var(--tiny);
      }

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      ${plainTextView &&
      css`
        margin: unset;
        padding: unset;
        background-color: unset;
        width: unset;
        height: unset;
        display: unset;

        .value {
          font-size: unset;
        }
      `}
    }
  `
);
