import styled, { css } from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

type StyledMyNFTProps = {
  disabled: boolean;
};

export const StyledMyNFT = styled.div<StyledMyNFTProps>(
  ({ disabled }) => css`
    display: flex;
    flex-direction: column;
    border: 1px solid var(--blue-3);
    padding: 25px;
    margin-top: 20px;

    ${disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}

    .title {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: var(--small);
    }

    .airdrop-nfts-container {
      margin: 8px 0;
      margin-bottom: 24px;

      .nfts-slide {
        position: relative;
        display: flex;
        justify-content: center;

        video {
          width: 160px;

          @media (max-width: ${breakpointsDefinition.mobile}) {
            width: 200px;
          }
        }
      }
    }

    .no-nfts-text {
      font-size: var(--xxsmall);
      text-align: center;
      color: var(--gray-2);
    }

    .info-text-container {
      color: var(--white);
      margin: 20px 0;
      font-size: var(--xxsmall);
      white-space: pre-wrap;

      .info-text-1 {
        color: var(--yellow);
      }
    }

    .action-btn {
      margin: 10px 0;
      width: 100%;
    }
  `
);
