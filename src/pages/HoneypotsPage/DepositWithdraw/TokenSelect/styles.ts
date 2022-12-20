import styled, { css } from "styled-components";

type StyledTokenSelectProps = {
  type?: string;
};

export const StyledVaultChainIcon = styled.div<StyledTokenSelectProps>(
  ({ type }) => css`
    .chain-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 0px;
      right: 8px;
      width: 22px;
      height: 22px;
      border-radius: 100px;
      background-color: var(--dark-blue);

      ${type === "gamification" &&
      css`
        background-color: var(--strong-purple);
      `}

      ${type === "grants" &&
      css`
        background-color: var(--turquoise-2);
      `}
    
      img {
        width: 18px;
        height: 18px;
        object-fit: contain;
        border-radius: 100px;
      }
    }
  `
);
