import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledCollapsableTextContent = styled.div<{
  isOpen: boolean;
  noContentPadding: boolean;
  inverseArrow: boolean;
  titleBold: boolean;
  color: string | undefined;
}>(
  ({ isOpen, noContentPadding, inverseArrow, color = "var(--secondary-light", titleBold }) => css`
    .title-container {
      display: flex;
      flex-direction: ${inverseArrow ? "row-reverse" : "row"};
      gap: ${getSpacing(1)};
      color: ${color};
      cursor: pointer;
      width: fit-content;

      ${titleBold &&
      css`
        font-weight: 700;
      `}

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
      color: var(--grey-400);

      ${isOpen &&
      css`
        display: block;
        margin-top: ${getSpacing(0.5)};
        margin-bottom: ${getSpacing(2)};
      `}
    }
  `
);
