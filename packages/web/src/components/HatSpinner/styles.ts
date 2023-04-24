import styled, { css } from "styled-components";
import HatsLogoLeft from "assets/icons/logo-left.svg";
import HatsLogoRight from "assets/icons/logo-right.svg";

export const StyledHatSpinner = styled.div<{ expanded: boolean }>(
  ({ expanded }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: ${expanded ? "100%" : "unset"};

    .hat-loader {
      animation: hatChange 1s infinite;
      background-position: center;
      background-size: contain;
      background-image: url(${HatsLogoLeft});
      width: 100px;
      height: 100px;
    }

    @keyframes hatChange {
      0%,
      100% {
        background-image: url(${HatsLogoLeft});
      }
      50% {
        background-image: url(${HatsLogoRight});
      }
    }
  `
);
