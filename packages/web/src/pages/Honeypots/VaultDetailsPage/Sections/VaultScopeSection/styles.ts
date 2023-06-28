import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledVaultScopeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(6)};
  padding-bottom: ${getSpacing(8)};

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
`;
