import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledKey = styled.div<{ noSelectable: boolean; viewOnly: boolean }>(
  ({ noSelectable, viewOnly }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${getSpacing(2.5)} ${getSpacing(2)} ${getSpacing(2.5)} ${getSpacing(3)};

    ${!noSelectable &&
    css`
      cursor: pointer;

      &:hover {
        background-color: var(--purple-blue);
        border-color: var(--turquoise);
      }
    `}

    ${viewOnly &&
    css`
      cursor: default;
      background-color: var(--purple-blue);
      border-color: var(--turquoise);
    `}
    
    .info {
      display: flex;
      align-items: center;
      gap: ${getSpacing(2)};

      p.createdAt {
        font-size: var(--tiny);
      }
    }

    .actions {
      display: flex;
      align-items: center;
      font-size: ${getSpacing(3.2)};
      gap: ${getSpacing(1.5)};

      .icon {
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          color: var(--grey-500);
        }
      }
    }
  `
);
