import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultScopeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(6)};
  padding-bottom: ${getSpacing(8)};
`;
