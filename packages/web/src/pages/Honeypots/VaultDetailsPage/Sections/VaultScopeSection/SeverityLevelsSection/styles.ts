import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSeverityLevelsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(4)};

  .severity {
    &:not(:last-child) {
      border-bottom: 1px solid var(--primary-light);
      padding-bottom: ${getSpacing(4)};
    }
  }
`;
