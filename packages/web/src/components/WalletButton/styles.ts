import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

type StyledWalletButtonProps = {
  existsPendingTransaction: boolean;
  connected: boolean;
  expanded: boolean;
};

export const WalletButtonWrapper = styled.div`
  position: relative;
`;

export const StyledWalletButton = styled.button<StyledWalletButtonProps>(
  ({ existsPendingTransaction, connected, expanded }) => css`
    border: 1px solid;
    color: var(--white);
    background-color: var(--blue);
    border: none;
    padding: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${getSpacing(1)};
    border-radius: 2px;
    position: relative;

    ${expanded &&
    css`
      width: 100%;
    `}

    ${connected &&
    css`
      gap: ${getSpacing(1.5)};
      padding: ${getSpacing(2)};
    `}

    &:hover {
      opacity: 0.8;
    }

    &:active {
      background-color: var(--light-blue);
    }

    @media (max-width: ${breakpointsDefinition.mobile}) {
      margin-left: auto;

      ${existsPendingTransaction &&
      css`
        display: none;
      `}
    }

    .provider-icon,
    .network-icon {
      img {
        width: 100%;
        height: 100%;
      }
    }

    .provider-icon {
      width: 35px;
      height: 35px;
      position: absolute;
      transform: translateX(-60%);
    }

    .network-icon {
      position: relative;
      width: 25px;
      height: 25px;
    }

    .signedIn {
      font-size: var(--tiny);
      position: absolute;
      width: 100%;
      bottom: 0;
      transform: translate(-50%, 100%);
      left: 50%;
      background-color: var(--blue);
      padding: 4px 12px;
      opacity: 0;
      transition: 0.2s;
    }

    &:hover {
      .signedIn {
        opacity: 1;
      }
    }
  `
);
