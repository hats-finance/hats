import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledPayoutsListPage = styled.div`
  position: relative;
  background: var(--background-2);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(6)};

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${getSpacing(5)};

    .title {
      display: flex;
      align-items: center;
      font-size: var(--moderate);

      p {
        margin-left: ${getSpacing(1)};

        span {
          font-weight: 700;
        }
      }
    }
  }

  .group {
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(2)};

    &:not(:last-child) {
      margin-bottom: ${getSpacing(3)};
    }

    .group-date {
      color: var(--grey-500);
      font-weight: 700;
    }
  }
`;

export const PayoutListSections = styled.div`
  display: flex;
  gap: ${getSpacing(2)};
  margin-bottom: ${getSpacing(4)};
  border-bottom: 1px solid var(--grey-600);
`;

export const PayoutListSection = styled.div<{ active: boolean }>(
  ({ active }) => css`
    display: flex;
    align-items: center;
    padding: 0 ${getSpacing(4)} ${getSpacing(4)} ${getSpacing(4)};
    border-bottom: 1px solid transparent;
    cursor: pointer;
    transition: 0.2s;

    ${active &&
    css`
      border-bottom-color: var(--secondary);
    `}

    &:hover {
      opacity: 0.7;
    }
  `
);

export const StyledPayoutsWelcome = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: ${getSpacing(10)};
  color: var(--white);

  .container {
    width: 100%;
    max-width: 500px;

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
  }
`;

export const StyledPayoutCreateModal = styled.div`
  width: 400px;
  color: var(--white);

  .vault-selection {
    padding-top: ${getSpacing(2)};

    .options {
      display: flex;
      gap: ${getSpacing(2)};
      justify-content: flex-end;
    }
  }
`;
