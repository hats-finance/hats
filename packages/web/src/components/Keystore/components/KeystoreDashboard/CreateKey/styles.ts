import { getSpacing } from "styles";
import styled from "styled-components";

export const AdvancedModeContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  transform: translateY(-${getSpacing(1.5)});
`;
