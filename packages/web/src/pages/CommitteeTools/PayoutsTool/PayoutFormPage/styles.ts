import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledPayoutFormPage = styled.div`
  position: relative;
  background: var(--background-clear-blue);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(6)};
  color: var(--white);

  .title-container {
    display: flex;
    justify-content: space-between;
    margin-top: ${getSpacing(1)};

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

  .lastModifiedOn {
    position: absolute;
    margin: 0;
    top: 0;
    right: ${getSpacing(2)};
    color: var(--grey-400);
    background: var(--grey-600);
    font-size: var(--xxsmall);
    padding: ${getSpacing(0.6)} ${getSpacing(1.4)};
    border-radius: 5px;
    transform: translateY(-50%);
    cursor: default;
  }
`;

export const StyledPayoutForm = styled.form`
  .form-container {
    background: var(--background-clearer-blue);
    border-radius: 4px;
    padding: ${getSpacing(2.5)};

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

    .row {
      display: flex;
      gap: ${getSpacing(2)};
    }

    .resultDivider {
      display: flex;
      align-items: center;
      gap: ${getSpacing(2)};
      margin: ${getSpacing(3)} 0;

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

  .buttons {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: ${getSpacing(2)};
    border-top: 1px solid var(--grey-600);
    padding-top: ${getSpacing(2)};
    margin-top: ${getSpacing(5)};
  }
`;
