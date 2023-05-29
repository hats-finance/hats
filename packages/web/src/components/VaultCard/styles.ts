import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultCard = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--background-2);
  border: 1px solid var(--primary-light);
  padding: ${getSpacing(4)} ${getSpacing(4)};

  .vault-info {
    display: grid;
    grid-template-columns: 3fr 2fr;
    align-items: center;

    .metadata {
      display: flex;
      align-items: center;
      gap: ${getSpacing(2)};

      img {
        width: ${getSpacing(9)};
        height: ${getSpacing(9)};
        object-fit: contain;
      }

      .name-description {
        display: flex;
        flex-direction: column;
        gap: ${getSpacing(0.5)};
      }
    }

    .amounts {
    }
  }

  .vault-actions {
    margin-top: 30px;
  }
`;
