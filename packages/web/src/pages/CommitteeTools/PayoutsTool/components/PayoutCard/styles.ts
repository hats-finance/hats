import styled, { css } from "styled-components";
import { PayoutStatus, payoutStatusInfo } from "@hats-finance/shared";
import { getSpacing } from "styles";

export const StyledPayoutCard = styled.div<{ status: PayoutStatus }>(
  ({ status }) => css`
    background: var(--background-clearer-blue);
    padding: ${getSpacing(2)};
    display: grid;
    align-items: center;
    gap: ${getSpacing(4)};
    grid-template-columns: auto auto 2fr 2fr 1fr 2fr;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }

    .vault-icon {
      position: relative;

      img.logo {
        width: 40px;
        height: 40px;
        object-fit: contain;
        border-radius: 100px;
      }

      .chain-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 0px;
        right: -8px;
        width: 26px;
        height: 26px;
        border-radius: 100px;
        background: var(--background-clearer-blue);

        img {
          width: 22px;
          height: 22px;
          object-fit: contain;
          border-radius: 100px;
        }
      }
    }

    .status {
      .content {
        color: var(${payoutStatusInfo[status].color});
      }
    }

    .col {
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(0.5)};

      .title {
        font-size: var(--xxsmall);
        color: var(--grey-500);
      }
    }
  `
);
