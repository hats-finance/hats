import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledDelegateManager = styled.div`
  margin-top: ${getSpacing(5)};

  .change-delegate-container {
    width: 100%;

    .delegatees-list {
      display: flex;
      flex-wrap: wrap;
      gap: ${getSpacing(3)};
    }

    .buttons {
      display: flex;
      gap: ${getSpacing(2)};
      margin-top: ${getSpacing(3)};
    }
  }
`;

export const StyledDelegateeCard = styled.div<{ selected: boolean }>(
  ({ selected }) => css`
    border: 1px solid var(--primary);
    border-radius: ${getSpacing(1.5)};
    padding: ${getSpacing(2)} ${getSpacing(2.5)} ${getSpacing(0.5)};
    position: relative;
    cursor: pointer;
    transition: 0.1s;
    width: fit-content;

    &:hover {
      background-color: var(--primary-light);
    }

    ${selected &&
    css`
      background-color: var(--primary-light);
      border: 1px solid var(--secondary);
    `}

    .icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: ${getSpacing(2)};

      img {
        width: 100%;
        height: 100%;
      }
    }

    .votes {
      background: var(--primary);
      font-weight: 700;
      position: absolute;
      top: 20px;
      right: 0;
      padding: ${getSpacing(0.5)} ${getSpacing(2)};
      border-radius: 50px 0 0 50px;
      font-size: var(--xxsmall);
    }

    .address {
      font-size: var(--xxsmall);
      color: var(--grey-400);
    }

    .name {
      font-weight: 700;
      font-size: var(--small);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--primary);
    }

    .description {
      ol,
      ul {
        margin-top: 0;
        padding-left: ${getSpacing(2.5)};
        display: flex;
        flex-direction: column;
        gap: ${getSpacing(0.5)};
        font-size: var(--xxsmall);

        li {
          margin: 0;
          padding: 0;
        }
      }
    }

    .delegate-self {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: 100%;
      font-weight: 700;
    }
  `
);

export const StyledSuccessModal = styled.div`
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${getSpacing(3)};

  img {
    width: ${getSpacing(14)};
    margin-bottom: ${getSpacing(2)};
  }
`;
