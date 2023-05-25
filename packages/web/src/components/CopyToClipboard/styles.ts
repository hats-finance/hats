import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledCopyToClipboard = styled.div<{ simple: boolean }>(
  ({ simple }) => css`
    .copy-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${getSpacing(4)};
      height: ${getSpacing(4)};
      padding: ${getSpacing(1)};
      font-size: var(--xsmall);
      background: ${simple ? "transparent" : "var(--grey-700)"};
      color: ${simple ? "inherit" : "var(--secondary)"};
      border-radius: ${getSpacing(0.5)};
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        opacity: 0.7;
      }
    }
  `
);
