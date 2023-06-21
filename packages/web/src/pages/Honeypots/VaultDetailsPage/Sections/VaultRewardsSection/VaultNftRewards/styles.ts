import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultNftRewards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${getSpacing(2)};
`;
