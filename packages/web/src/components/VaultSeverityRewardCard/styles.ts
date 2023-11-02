import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledVaultSeverityRewardCard = styled.div<{ color: string; columns: number }>(
  ({ color, columns }) => css`
    display: grid;
    grid-template-columns: ${columns === 2 ? "3fr 4fr" : columns === 3 ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr"};
    align-items: center;
    justify-content: space-between;
    gap: ${getSpacing(2)};

    .severity-name,
    .severity-prize,
    .severity-nft {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .severity-nft,
    .severity-prize {
      justify-content: flex-end;
    }

    @media (max-width: ${breakpointsDefinition.mediumMobile}) {
      grid-template-columns: ${columns === 2 ? "1fr 1fr" : columns === 3 ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr"};
    }

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      grid-template-columns: ${columns === 2 ? "1fr" : columns === 3 ? "1fr 1fr" : "1fr 1fr"};

      .severity-name {
        grid-column-start: 1;
        grid-column-end: ${columns};
      }
    }

    .severity-name {
      justify-content: flex-start;
      text-transform: capitalize;
      font-weight: 700;
    }

    .severity-prize {
      font-weight: 700;
      flex-direction: column;
      align-items: flex-end;

      @media (max-width: ${breakpointsDefinition.smallMobile}) {
        align-items: center;
      }

      .title-container {
        display: flex;
        align-items: center;
        gap: ${getSpacing(0.2)};
      }

      .tiny {
        font-size: var(--xxsmall);
        font-weight: 400;
      }

      .price {
        font-size: var(--small);
        color: ${color};
        font-weight: 700;

        span.smaller {
          margin-left: ${getSpacing(0.5)};
          font-size: var(--xxsmall);
        }
      }
    }
  `
);
