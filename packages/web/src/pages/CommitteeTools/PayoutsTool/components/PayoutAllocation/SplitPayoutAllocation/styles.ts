import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledBeneficiariesTable = styled.div`
  display: block;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(2)};
`;

export const StyledSplitPayoutBeneficiaryForm = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(1.5)};
    background: var(--background-3);
    padding: ${getSpacing(2.5)};
    position: relative;

    .beneficiary {
      display: flex;
      border-bottom: 1px solid var(--grey-600);
      padding-bottom: ${getSpacing(3)};

      .w-100 {
        width: 100%;
      }

      .input {
        width: 70%;
        display: flex;
        align-items: center;
        gap: ${getSpacing(2)};
      }

      .more-button {
        position: absolute;
        top: ${getSpacing(2.5)};
        right: ${getSpacing(2.5)};
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          opacity: 0.8;
        }
      }
    }

    .title {
      font-weight: 700;
    }

    .form {
      .controls {
        padding-top: ${getSpacing(1.5)};
        display: flex;
        justify-content: center;
        align-items: center;
        gap: ${getSpacing(1.5)};

        > :nth-child(1) {
          width: 34%;
        }

        > :not(:nth-child(1)) {
          width: 22%;
        }
      }
    }
  `
);

export const StyledSplitPayoutSummary = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(2)};
  border: 1px solid var(--grey-600);
  padding: ${getSpacing(2.5)};

  hr {
    border: 1px solid var(--grey-600);
    border-top: 0;
  }

  .item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    &.error {
      color: var(--error-red);
    }

    &.bold {
      font-weight: 700;
    }

    &.light {
      color: var(--grey-500);
    }

    span.clicklable {
      cursor: pointer;
      text-transform: uppercase;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .severities {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: ${getSpacing(4)};
    margin-top: ${getSpacing(2)};

    .severity {
      display: flex;
      gap: ${getSpacing(1)};
      text-transform: capitalize;
    }
  }
`;

export const StyledSplitPayoutBeneficiaryAllocationModal = styled.div`
  width: 550px;
  max-width: 100%;
  color: var(--white);
`;

export const StyledAdditionalBeneficiariesInfo = styled.div`
  margin-top: ${getSpacing(2)};

  .section {
    margin-bottom: ${getSpacing(2)};

    p.title {
      margin-bottom: ${getSpacing(0.4)};
    }

    .depositors-list {
      display: flex;
      flex-direction: column;

      .depositor {
        display: flex;
        gap: ${getSpacing(1.5)};
      }
    }
  }
`;
