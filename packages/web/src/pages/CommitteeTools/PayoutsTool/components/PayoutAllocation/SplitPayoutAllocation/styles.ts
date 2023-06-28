import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledBeneficiariesTable = styled.div`
  display: block;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(2)};
`;

export const StyledSplitPayoutBeneficiaryForm = styled.div<{ isHeader: boolean }>(
  ({ isHeader }) => css`
    display: flex;
    align-items: ${isHeader ? "center" : "baseline"};
    gap: ${getSpacing(1.5)};

    ${isHeader &&
    css`
      font-size: var(--xxsmall);
      color: var(--grey-500);
      text-align: center;
    `}

    .cell {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(5% / 2);

      &.small {
        width: 15%;
      }

      &.big {
        width: 25%;
      }

      .more-icon {
        cursor: pointer;
        transition: 0.3s;

        &:hover {
          color: var(--secondary);
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
  border-top: 2px solid var(--grey-600);
  border-bottom: 2px solid var(--grey-600);
  padding: ${getSpacing(2)} 0;

  .item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.error {
      color: var(--error-red);
    }

    &.bold {
      font-weight: 700;
    }

    &.light {
      color: var(--grey-500);
    }

    span {
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
