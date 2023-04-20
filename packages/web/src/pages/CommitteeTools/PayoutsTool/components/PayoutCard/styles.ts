import styled, { css } from "styled-components";
import { PayoutStatus, payoutStatusInfo } from "@hats-finance/shared";
import { getSpacing } from "styles";

export const StyledPayoutCard = styled.div<{ status: PayoutStatus; minSignersReached: boolean; viewOnly: boolean }>(
  ({ status, minSignersReached, viewOnly }) => css`
    position: relative;
    background: var(--background-clearer-blue);
    padding: ${getSpacing(2)} ${getSpacing(2)} ${getSpacing(2)} ${getSpacing(5)};
    display: grid;
    align-items: center;
    gap: ${getSpacing(4)};
    grid-template-columns: auto auto 2fr 2fr 1fr 2fr;
    cursor: ${viewOnly ? "default" : "pointer"};
    transition: 0.2s;

    ${!viewOnly &&
    css`
      &:hover {
        opacity: 0.8;
      }

      &:active {
        opacity: 0.6;
      }
    `}

    .vault-address {
      position: absolute;
      margin: 0;
      top: 0;
      left: ${getSpacing(2)};
      color: var(--grey-400);
      background: var(--grey-600);
      font-size: var(--xxsmall);
      padding: ${getSpacing(0.6)} ${getSpacing(1.4)};
      border-radius: 5px;
      transform: translateY(-75%);
      z-index: 3;
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

    .signers {
      .content {
        color: ${minSignersReached ? "unset" : "var(--warning-yellow)"};
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

export const StyledVersionFlag = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  text-transform: uppercase;
  background-color: var(--turquoise);
  color: var(--strong-blue);
  padding: 10px 6px;
  border-radius: 0 0 18px 0;
  font-size: var(--xsmall);
`;
