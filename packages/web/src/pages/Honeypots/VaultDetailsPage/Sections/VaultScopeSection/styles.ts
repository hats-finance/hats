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
      gap: ${getSpacing(1)};

      .icon {
        font-size: var(--medium-2);
      }
    }
  }
`;
