import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSignerCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${getSpacing(2)};

  .identicon {
    border-radius: 100px;
  }
`;
