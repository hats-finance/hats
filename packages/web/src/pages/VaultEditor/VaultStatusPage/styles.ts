import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultStatusPage = styled.div`
  position: relative;
  background: var(--background-clear-blue);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(8)} !important;

  .status-title {
    display: flex;
    align-items: center;
    color: var(--white);
    font-size: var(--moderate);
    margin-bottom: ${getSpacing(5)};
    margin-left: ${getSpacing(1)};
    padding-bottom: ${getSpacing(6)};
    border-bottom: 1px solid var(--grey-600);

    span {
      font-weight: 700;
    }
  }

  .status-cards {
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(2)};
    color: var(--white);

    .status-card {
      background: var(--background-clearer-blue);
      border-radius: 4px;
      padding: ${getSpacing(2)};

      &__title {
        margin-bottom: ${getSpacing(1.5)};
        text-transform: uppercase;
        font-weight: 700;
        font-size: var(--small);
      }

      &__text {
        margin-bottom: ${getSpacing(1)};
        line-height: ${getSpacing(2.5)};
      }
    }
  }
`;
