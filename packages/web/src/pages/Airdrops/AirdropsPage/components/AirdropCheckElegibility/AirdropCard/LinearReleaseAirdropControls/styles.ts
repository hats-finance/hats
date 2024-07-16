import styled, { css } from "styled-components";
import { getSpacing } from "styles";

const colors = {
  released: "#24E8C5",
  releasable: "#769CFF",
  pending: "#242541",
};

export const StyledLinearReleaseAirdropControls = styled.div<{ standalone: boolean }>(
  ({ standalone }) => css`
    width: 100%;
    margin-top: ${getSpacing(6)};

    ${standalone &&
    css`
      background: var(--background-clear-blue-2);
      padding: ${getSpacing(4)} ${getSpacing(4.5)};
      border-radius: ${getSpacing(1.5)};
    `}

    .chain-address {
      display: flex;
      align-items: center;
      gap: ${getSpacing(2)};
      margin-bottom: ${getSpacing(2)};

      .address {
        display: flex;
        align-items: center;
        gap: ${getSpacing(1)};
      }

      .network {
        display: flex;
        align-items: center;
        gap: ${getSpacing(0.5)};

        img {
          width: ${getSpacing(2.5)};
          height: ${getSpacing(2.5)};
        }
      }
    }

    .legend {
      width: 100%;
      display: flex;
      align-items: center;
      gap: ${getSpacing(2)};

      &__item {
        display: flex;
        align-items: center;
        gap: ${getSpacing(1)};

        span {
          font-weight: 700;
        }

        .dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: inline-block;

          &.released {
            background-color: ${colors.released};
          }

          &.releasable {
            background-color: ${colors.releasable};
          }

          &.pending {
            background-color: ${colors.pending};
          }
        }
      }
    }

    .dates {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        font-weight: 700;
      }
    }

    .buttons {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: ${getSpacing(2)};
      margin-top: ${getSpacing(6)};
    }
  `
);

export const StyledLinearReleaseProgressBar = styled.div<{
  percentages: { released: number; releasable: number };
}>(
  ({ percentages }) => css`
    width: 100%;
    height: 14px;
    border-radius: 50px;
    background-color: ${colors.pending};
    position: relative;
    z-index: 1;
    margin: ${getSpacing(2)} 0 ${getSpacing(1.2)};

    .releasable,
    .released {
      position: absolute;
      top: 0;
      left: 0;
      height: 14px;
      border-radius: 50px;
    }

    .released {
      width: ${percentages.released}%;
      background-color: ${colors.released};
      z-index: 3;
    }

    .releasable {
      width: ${percentages.releasable}%;
      background-color: ${colors.releasable};
      z-index: 2;
    }
  `
);
