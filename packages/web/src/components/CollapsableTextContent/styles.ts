import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledCollapsableTextContent = styled.div<{ isOpen: boolean; noContentPadding: boolean; inverseArrow: boolean }>(
  ({ isOpen, noContentPadding, inverseArrow }) => css`
    .title-container {
      display: flex;
      flex-direction: ${inverseArrow ? "row-reverse" : "row"};
      gap: ${getSpacing(1)};
      color: var(--secondary-light);
      cursor: pointer;
      width: fit-content;

      &:hover {
        color: var(--secondary);
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
      margin-left: ${noContentPadding ? 0 : getSpacing(3.5)};
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
