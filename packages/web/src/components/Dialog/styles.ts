import { getSpacing } from "styles";
import styled from "styled-components";

export const StyledDialog = styled.div`
  max-width: 400px;
  width: 100%;
  color: var(--white);

  .description {
    margin: ${getSpacing(3)} 0 ${getSpacing(6)};
  }

  .button-container {
    display: flex;
    justify-content: space-between;
    gap: ${getSpacing(10)};
  }
`;
