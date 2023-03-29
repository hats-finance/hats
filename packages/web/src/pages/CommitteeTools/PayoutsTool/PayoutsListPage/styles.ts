import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledPayoutsListPage = styled.div`
  position: relative;
  background: var(--background-clear-blue);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(6)};

  .title-container {
    display: flex;
    justify-content: space-between;

    .title {
      display: flex;
      align-items: center;
      color: var(--white);
      font-size: var(--moderate);
      margin-bottom: ${getSpacing(5)};
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        opacity: 0.8;
      }

      p {
        margin-left: ${getSpacing(1)};

        span {
          font-weight: 700;
        }
      }
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
      border-bottom-color: var(--turquoise);
    `}

    &:hover {
      opacity: 0.7;
    }
  `
);
