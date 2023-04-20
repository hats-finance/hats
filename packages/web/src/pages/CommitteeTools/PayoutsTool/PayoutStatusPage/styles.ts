import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledPayoutStatusPage = styled.div`
  position: relative;
  background: var(--background-clear-blue);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(6)};
  color: var(--white);

  .title-container {
    display: flex;
    justify-content: space-between;

    .title {
      display: flex;
      align-items: center;
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

  .section-title {
    font-size: var(--small);
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: ${getSpacing(2)};
    padding-bottom: ${getSpacing(2)};
    border-bottom: 1px solid var(--grey-600);
  }

  .status-description {
    margin: ${getSpacing(2.5)} 0;
  }

  .payout-status {
    background: var(--background-clearer-blue);
    padding: ${getSpacing(3)};
    margin-bottom: ${getSpacing(6)};

    .form {
      .row {
        display: flex;
        gap: ${getSpacing(2)};
      }

      .resultDivider {
        display: flex;
        align-items: center;
        gap: ${getSpacing(2)};
        margin: ${getSpacing(1)} 0 ${getSpacing(3)};

        div {
          flex: 1;
          height: 1px;
          border: 1px solid var(--grey-500);
          border-style: dashed;
        }
      }

      .result {
        display: flex;
        gap: ${getSpacing(3)};
      }
    }

    .signers {
      margin-top: ${getSpacing(4)};
      margin-bottom: ${getSpacing(10)};

      &-list {
        display: flex;
        flex-direction: column;
        gap: ${getSpacing(5)};
        margin: ${getSpacing(3)} ${getSpacing(1)};
      }
    }

    .buttons {
      display: flex;
      gap: ${getSpacing(2)};
      justify-content: flex-end;
      padding-top: ${getSpacing(4)};
    }
  }
`;
