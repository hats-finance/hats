import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledCollapsableTextContent = styled.div<{ isOpen: boolean }>(
  ({ isOpen }) => css`
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
      margin-top: ${getSpacing(1)};
      overflow: hidden;
      height: 0;
      transition: 0.3s;

      ${isOpen &&
      css`
        height: auto;
      `}
    }
  `
);
