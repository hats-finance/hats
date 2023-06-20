import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultAssetsList = styled.div`
  .token {
    display: flex;
    align-items: center;
    gap: ${getSpacing(1.5)};
    padding: ${getSpacing(0.6)} ${getSpacing(1)};
    border-radius: 50px;
    background: var(--background-3);
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 0.7;
    }

    .images {
      position: relative;
      width: ${getSpacing(2.8)};
      height: ${getSpacing(2.8)};

      img.logo {
        width: ${getSpacing(2.8)};
        height: ${getSpacing(2.8)};
        object-fit: contain;
        border-radius: 500px;
      }

      img.chain {
        width: ${getSpacing(1.5)};
        height: ${getSpacing(1.5)};
        object-fit: contain;
        position: absolute;
        bottom: 0;
        right: -6px;
      }
    }

    span {
      font-size: var(--xxsmall);
      font-weight: 700;
    }
  }
`;
