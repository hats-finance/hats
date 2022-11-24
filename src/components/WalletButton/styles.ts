import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

type StyledWalletButtonProps = {
  existsPendingTransaction: boolean;
  connected: boolean;
};

export const WalletButtonWrapper = styled.div`
  position: relative;
`;

export const StyledWalletButton = styled.button<StyledWalletButtonProps>(
  ({ existsPendingTransaction, connected }) => css`
    border: 1px solid;
    color: var(--white);
    background-color: var(--blue);
    border: none;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: ${getSpacing(1)};
    border-radius: 2px;
    position: relative;

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

    .network-icon {
      width: 25px;
      height: 25px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  `
);

export const StyledDropdownOptions = styled.div`
  position: absolute;
  z-index: 100;
  padding: ${getSpacing(1)};
  top: calc(100% + ${getSpacing(1)});
  right: 0;
  background-color: var(--blue);
  width: 260px;
  border-radius: 2px;

  .connector-option {
    padding: ${getSpacing(1)};
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${getSpacing(1.5)};

    &:hover {
      background-color: var(--light-blue);
    }

    &:active {
      opacity: 0.7;
    }

    span {
      color: var(--white);
    }

    img {
      width: 20px;
    }
  }
`;
