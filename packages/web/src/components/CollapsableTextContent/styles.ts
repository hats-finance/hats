import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledCollapsableTextContent = styled.div<{ isOpen: boolean; noContentPadding: boolean }>(
  ({ isOpen, noContentPadding }) => css`
    .title-container {
      display: flex;
      gap: ${getSpacing(1)};
      color: var(--dark-turquoise);
      cursor: pointer;

      &:hover {
        color: var(--turquoise-1);
      }

      .arrow {
        transition: 0.3s;

        ${!isOpen &&
        css`
          transform: rotateX(-180deg);
        `}
      }
    }

    .content-container {
      font-size: var(--xxsmall);
      margin-left: ${noContentPadding ? 0 : getSpacing(3)};
      overflow: hidden;
      display: none;

      ${isOpen &&
      css`
        display: block;
        margin-top: ${getSpacing(1.5)};
      `}
    }
  `
);
