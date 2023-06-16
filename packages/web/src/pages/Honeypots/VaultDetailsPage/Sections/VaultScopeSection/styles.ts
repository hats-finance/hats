import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledScopeSection = styled.div`
  .scope-section-container {
    border: 1px solid var(--primary-light);
    padding: ${getSpacing(3)} ${getSpacing(2.5)};
    margin-top: ${getSpacing(2)};

    h3.section-subtitle {
      display: flex;
      align-items: center;
      gap: ${getSpacing(1.5)};

      .icon {
        font-size: var(--medium-2);
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
    }
  }
`;
