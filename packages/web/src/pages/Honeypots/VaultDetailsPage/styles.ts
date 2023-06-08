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

    .vaultCard {
      margin-top: ${getSpacing(4)};
      padding-bottom: ${getSpacing(3)};
      border-bottom: 1px solid var(--primary-light);
    }
  `
);
