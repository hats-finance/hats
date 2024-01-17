import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultSeverityRewards = styled.div`
  margin-top: ${getSpacing(0)};
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(3)};
  overflow: auto;
  width: 100%;

  & > div:not(:last-child) {
    padding-bottom: ${getSpacing(2)};
    border-bottom: 1px solid var(--primary-light);
  }
`;
