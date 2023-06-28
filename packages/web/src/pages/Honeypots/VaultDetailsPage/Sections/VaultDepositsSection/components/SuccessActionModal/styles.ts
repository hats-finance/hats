import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSuccessActionModal = styled.div`
  width: 320px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${getSpacing(3)};

  img {
    width: 50%;
  }

  h2 {
    text-align: center;
  }
`;
