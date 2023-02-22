import { getSpacing } from "styles";
import styled from "styled-components";

export const StyledVaultEditorHome = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: ${getSpacing(10)};

  .container {
    width: 100%;
    max-width: 360px;
    color: var(--white);

    p.title {
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: ${getSpacing(4)};
      font-size: var(--moderate);
    }

    .divider {
      display: flex;
      align-items: center;
      gap: ${getSpacing(2)};
      margin: ${getSpacing(4)} 0;

      div {
        width: 100%;
        height: 1px;
        background-color: var(--grey-600);
      }
    }

    .vault-selection {
      margin-top: ${getSpacing(3)};

      .options {
        display: flex;
        gap: ${getSpacing(2)};
        justify-content: flex-end;
      }
    }
  }
`;

export const CreatingVaultModal = styled.div`
  max-width: 400px;
  color: var(--white);
  text-align: center;
`;
