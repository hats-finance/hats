import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledVaultDetailsPage = styled.div<{ isAudit: boolean; tabsNumber: number }>(
  ({ isAudit, tabsNumber }) => css`
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
      padding-top: ${getSpacing(6)};
      margin-top: ${getSpacing(4)};
      display: grid;
      grid-template-columns: repeat(${tabsNumber}, 1fr);
      gap: ${getSpacing(2)};
      overflow-x: auto;
      overflow-y: hidden;

      @media (max-width: ${breakpointsDefinition.mediumMobile}) {
        margin-top: 0;
      }
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
    padding: ${getSpacing(2)} ${getSpacing(2)};
    transition: 0.2s;
    border-radius: ${getSpacing(1)} ${getSpacing(1)} 0 0;

    &:hover {
      border-bottom: 1px solid var(--primary);
      background: var(--background-2);
    }

    h4 {
      font-weight: 400;
      font-size: var(--small);
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
