import styled, { css } from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledVaultSeverityRewardCard = styled.div<{ color: string; noNft: boolean }>(
  ({ color, noNft }) => css`
    display: grid;
    grid-template-columns: ${noNft ? "3fr 4fr" : "1fr 1fr 1fr"};
    align-items: center;
    justify-content: space-between;

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
      grid-template-columns: ${noNft ? "1fr 1fr" : "2fr 1fr 1fr"};
    }

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      grid-template-columns: ${noNft ? "1fr 1fr" : "4fr 4fr 3fr"};
    }

    .severity-name {
      justify-content: flex-start;
      text-transform: capitalize;
      font-weight: 700;
    }

    .severity-prize {
      font-weight: 700;

      @media (max-width: ${breakpointsDefinition.mediumMobile}) {
        flex-direction: column;
        align-items: flex-end;
      }

      .tiny {
        font-size: var(--xxsmall);
        font-weight: 400;
      }

      .price {
        color: ${color};
        font-weight: 700;
      }
    }
  `
);
