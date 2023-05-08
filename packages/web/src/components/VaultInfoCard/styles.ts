import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultInfoCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${getSpacing(1)} 0;

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${getSpacing(2)};

    &.grey {
      color: var(--grey-500);
    }

    img {
      width: ${getSpacing(5)};
      height: ${getSpacing(5)};
      object-fit: contain;
    }

    .icon {
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }
  }
`;
