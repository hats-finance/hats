import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultNftRewards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 220px);
  gap: ${getSpacing(2)};
  justify-content: space-evenly;
`;
