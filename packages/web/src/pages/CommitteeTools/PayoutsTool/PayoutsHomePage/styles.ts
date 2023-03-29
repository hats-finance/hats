import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledPayoutsHome = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: ${getSpacing(10)};

  .container {
    color: var(--white);
    width: 100%;
    max-width: 480px;
  }
`;
