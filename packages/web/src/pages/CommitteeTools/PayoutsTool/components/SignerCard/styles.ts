import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSignerCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${getSpacing(2)};

  .identicon {
    border-radius: 100px;
  }

  .action-icon {
    cursor: pointer;
    transition: 0.2s;
    margin-right: ${getSpacing(2)};

    &:hover {
      opacity: 0.8;
    }
  }
`;
