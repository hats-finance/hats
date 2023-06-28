import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledWalletInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;

  @media (max-width: ${breakpointsDefinition.mobile}) {
    margin: auto;
  }

  .wallet-info__my-account-btn {
    color: var(--white);
    margin-right: 20px;
    position: relative;

    .wallet-info__my-account-hat-balance {
      padding-left: 10px;
      margin-left: 10px;
      border-left: 1px solid var(--turquoise);
    }

    .wallet-info__my-account-btn-notification {
      position: absolute;
      height: 20px;
      width: 20px;
      margin: unset;
      top: -10px;
      left: -10px;
    }
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  .disconnect-prompt-wrapper {
    display: flex;
    height: 100%;
    justify-content: flex-end;
    flex-direction: column;
    padding: var(--modal-element-padding-mobile);

    button {
      color: var(--turquoise);
      background: transparent;
      border: 1px solid var(--turquoise);

      &.disconnect {
        background-color: var(--turquoise);
        color: var(--blue);
      }
    }
  }
`;
