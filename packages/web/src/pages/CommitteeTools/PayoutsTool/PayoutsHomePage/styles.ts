import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledPayoutsHome = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: ${getSpacing(10)};

  .container {
    color: var(--white);
    width: 100%;
    max-width: 400px;

    .title-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: ${getSpacing(5)};

      img {
        width: ${getSpacing(10)};
      }

      p {
        font-weight: 700;
        text-transform: uppercase;
        font-size: var(--moderate);
        text-align: center;
      }
    }

    .vault-selection {
      padding-top: ${getSpacing(2)};

      .options {
        display: flex;
        gap: ${getSpacing(2)};
        justify-content: flex-end;
      }
    }
  }
`;
