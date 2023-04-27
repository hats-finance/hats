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

  .payout-status-container {
    background: var(--background-clearer-blue);
    padding: ${getSpacing(3)};
    margin-bottom: ${getSpacing(3)};
    position: relative;

    &.top-separation {
      margin-top: ${getSpacing(4)};
    }

    .mulsitig-address {
      position: absolute;
      margin: 0;
      top: 0;
      left: ${getSpacing(2)};
      color: var(--grey-400);
      background: var(--grey-600);
      font-size: var(--xxsmall);
      padding: ${getSpacing(0.6)} ${getSpacing(1.4)};
      border-radius: 5px;
      transform: translateY(-55%);
      z-index: 1;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }

    .row {
      display: flex;
      gap: ${getSpacing(2)};
    }

    .subtitle {
      text-transform: uppercase;
      font-weight: 700;
      font-size: var(--small);
    }

    .reasoningAlert {
      font-size: var(--xxsmall);

      span {
        color: var(--teal);
      }
    }

    .signers-list {
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(5)};
      margin: ${getSpacing(4)} ${getSpacing(1)};
    }

    .buttons {
      display: flex;
      gap: ${getSpacing(2)};
      justify-content: flex-end;
      padding-top: ${getSpacing(4)};
    }
  }
`;
