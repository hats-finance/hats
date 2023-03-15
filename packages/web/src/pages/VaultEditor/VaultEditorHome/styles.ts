import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

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

export const StyledVaultReadyModal = styled.div`
  max-width: 670px;
  color: var(--white);
  text-align: center;

  img {
    width: ${getSpacing(20)};
    margin-bottom: ${getSpacing(2)};
  }

  .info {
    background: var(--strong-blue);
    font-size: var(--small);
    line-height: 1.6;
    border-radius: ${getSpacing(1)};
    padding: ${getSpacing(4)};
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: ${breakpointsDefinition.mobile}) {
      padding: ${getSpacing(3)};
    }

    .title {
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: ${getSpacing(3)};
    }

    .description {
      margin-bottom: ${getSpacing(5)};
    }
  }
`;
