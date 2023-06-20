import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

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
      padding-top: ${getSpacing(6)};
      margin-top: ${getSpacing(4)};
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: ${getSpacing(2)};
      overflow-x: auto;
      overflow-y: hidden;

      @media (max-width: ${breakpointsDefinition.mediumMobile}) {
        margin-top: 0;
      }
    }

    .section-container {
      margin-top: ${getSpacing(4)};

      .subsection-container {
        border: 1px solid var(--primary-light);
        padding: ${getSpacing(2.5)} ${getSpacing(4)};
        margin-top: ${getSpacing(2)};

        @media (max-width: ${breakpointsDefinition.smallMobile}) {
          padding: ${getSpacing(2)} ${getSpacing(1.5)};
        }

        h4.section-subtitle {
          display: flex;
          align-items: center;
          gap: ${getSpacing(1.5)};

          .icon {
            font-size: var(--medium);
          }
        }

        .section-content {
          margin-top: ${getSpacing(2)};
          padding-left: ${getSpacing(2)};

          a {
            text-decoration: underline;
          }
        }

        .separator {
          height: 1px;
          width: 100%;
          background-color: var(--primary-light);
          margin: ${getSpacing(5)} 0;

          &.small {
            margin: ${getSpacing(2)} 0;
          }
        }
      }
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
