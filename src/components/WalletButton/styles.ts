import styled, { css } from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

type StyledWalletButtonProps = {
  existsPendingTransaction: boolean;
};

export const StyledWalletButton = styled.button<StyledWalletButtonProps>(
  ({ existsPendingTransaction }) => css`
    border: 1px solid;
    color: var(--white);
    background-color: var(--blue);
    min-height: var(--header-button-hight);
    border: none;
    padding: 15px;
    display: flex;
    align-items: center;

    &:active {
      background-color: var(--light-blue);
      opacity: 1;
    }

    @media (max-width: ${breakpointsDefinition.mobile}) {
      padding: 0 10px;
      margin-left: auto;

      ${existsPendingTransaction &&
      css`
        display: none;
      `}
    }
  `
);
