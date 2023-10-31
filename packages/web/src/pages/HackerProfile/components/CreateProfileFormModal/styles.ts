import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledCreateProfileFormModal = styled.div<{ firstStep: boolean }>(
  ({ firstStep }) => css`
    width: 420px;
    max-width: 90vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    .alerts {
      margin-top: ${getSpacing(3)};
      width: 100%;
    }

    .hats-boat {
      margin: ${getSpacing(4)} 0;
      width: ${getSpacing(20)};
    }

    .create-profile-step {
      width: 100%;
      font-size: var(--small);
      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        font-size: var(--moderate-big);
        font-weight: 700;
        margin-bottom: ${getSpacing(3)};
        text-align: center;
      }

      ul {
        padding-left: ${getSpacing(3)};
      }

      .row {
        width: 100%;
        display: flex;
        align-items: center;
        gap: ${getSpacing(2)};
      }
    }

    .buttons {
      width: 100%;
      display: flex;
      justify-content: ${firstStep ? "center" : "space-between"};
      align-items: center;
      margin-top: ${getSpacing(5)};
    }

    .w-100 {
      width: 100%;
    }
  `
);
