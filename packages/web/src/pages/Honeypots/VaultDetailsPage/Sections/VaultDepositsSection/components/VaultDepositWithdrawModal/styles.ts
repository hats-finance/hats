import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultDepositWithdrawModal = styled.div`
  width: 420px;
  max-width: 100%;

  .balance {
    display: flex;
    align-items: center;
    gap: ${getSpacing(1)};
    color: var(--grey-400);
  }

  .input-box {
    background: var(--background);
    border: 1px solid var(--primary-light);
    padding: ${getSpacing(2.5)} ${getSpacing(2.5)};
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(2)};

    .input-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: ${getSpacing(2)};

      input {
        font-family: "IBM Plex Mono", monospace;
        font-size: var(--moderate);
        font-weight: 700;
        text-align: end;
        width: 100%;
        background: transparent;
        border: none;
      }
    }

    .prices-row {
      color: var(--grey-400);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  span.error {
    display: block;
    color: var(--error-red);
    margin-top: ${getSpacing(1)};
    margin-left: ${getSpacing(1)};
  }

  .buttons {
    margin-top: ${getSpacing(3)};
    display: flex;
    justify-content: flex-end;
  }
`;
