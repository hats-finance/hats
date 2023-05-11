import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledVaultRewardCard = styled.div<{ color: string }>(
  ({ color }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${getSpacing(1)} ${getSpacing(4)};
    background-color: ${color};

    @media (max-width: ${breakpointsDefinition.mediumMobile}) {
      padding: ${getSpacing(1)} ${getSpacing(2)};
    }

    .severity-name,
    .severity-prize,
    .severity-nft {
      width: 33%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: ${breakpointsDefinition.mediumMobile}) {
      .severity-name,
      .severity-prize {
        width: 40%;
      }

      .severity-nft {
        width: 20%;
      }
    }

    .severity-name {
      justify-content: flex-start;
    }

    .severity-prize {
      font-weight: 700;

      .tiny {
        font-size: var(--xxsmall);
        font-weight: 400;
      }

      .price {
        color: var(--turquoise);
        font-weight: 400;
      }
    }
  `
);
