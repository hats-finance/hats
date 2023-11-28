import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledPayoutFormPage = styled.div`
  position: relative;
  background: var(--background-2);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(6)};
  color: var(--white);

  .title-container {
    display: flex;
    justify-content: space-between;
    margin-top: ${getSpacing(1)};
    margin-bottom: ${getSpacing(3)};

    .title {
      display: flex;
      align-items: center;
      font-size: var(--moderate);
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
    display: flex;
    justify-content: space-between;
    align-items: center;
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

export const StyledPayoutForm = styled.div`
  .form-container {
    /* background: var(--background-3); */
    /* padding-top: ${getSpacing(3.5)}; */

    .subtitle {
      text-transform: uppercase;
      font-weight: 700;
      font-size: var(--small);
    }

    .beneficiary {
      display: flex;
      padding-bottom: ${getSpacing(3)};

      .input {
        width: 70%;
        display: flex;
        align-items: center;
        gap: ${getSpacing(2)};
      }
    }

    .reasoningAlert {
      font-size: var(--xxsmall);

      span {
        color: var(--secondary-light);
      }
    }

    .w-60 {
      width: 60%;

      @media (max-width: ${breakpointsDefinition.mobile}) {
        width: 100%;
      }
    }

    .w-40 {
      width: 40%;

      @media (max-width: ${breakpointsDefinition.mobile}) {
        width: 100%;
      }
    }

    .row {
      display: flex;
      gap: ${getSpacing(2)};
    }

    .sub-container {
      padding: ${getSpacing(2.5)};
      padding-bottom: 0;
      border: 1px solid var(--grey-600);
    }

    .rewards-constraints {
      .item {
        display: flex;
        align-items: flex-start;
        gap: ${getSpacing(2)};
        margin-top: ${getSpacing(2)};

        .pill {
          margin-top: ${getSpacing(2)};
          width: 26%;
        }

        .input {
          width: 37%;
        }
      }
    }

    .buttons-actions {
      display: flex;
      gap: ${getSpacing(1.5)};
      margin-top: ${getSpacing(2)};
    }
  }

  .buttons {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: ${getSpacing(2)};
    padding-top: ${getSpacing(2)};
    margin-top: ${getSpacing(5)};

    &.no-line {
      border-top: none;
      padding-top: 0;
    }

    &.end {
      justify-content: flex-end;
    }

    .sub-container {
      display: flex;
      gap: ${getSpacing(2)};
    }
  }

  p.error {
    font-size: var(--xxsmall);
    color: var(--error-red);
  }
`;
