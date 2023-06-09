import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultDetailsPage = styled.div<{ isAudit: boolean }>(
  ({ isAudit }) => css`
    .breadcrumb {
      span.type {
        color: var(--grey-500);
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          color: var(--grey-600);
        }
      }

      span.name {
        color: ${isAudit ? "var(--primary-lighter)" : "var(--secondary)"};
      }
    }

    .sections-tabs {
      border-top: 1px solid var(--primary-light);
      border-bottom: 1px solid var(--primary-light);
      padding-top: ${getSpacing(4)};
      margin-top: ${getSpacing(4)};
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }

    .section-container {
      margin-top: ${getSpacing(4)};
    }
  `
);

export const StyledSectionTab = styled.div<{ active: boolean }>(
  ({ active }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid transparent;
    cursor: pointer;
    padding: ${getSpacing(2)} 0;
    transition: 0.2s;
    border-radius: ${getSpacing(1)} ${getSpacing(1)} 0 0;

    &:hover {
      border-bottom: 1px solid var(--primary);
      background: var(--background-2);
    }

    h4 {
      font-weight: 400;
    }

    ${active &&
    css`
      border-bottom: 1px solid var(--primary);

      h4 {
        font-weight: 700;
      }
    `}
  `
);
