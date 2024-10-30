import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSplitPointsActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  margin-top: ${getSpacing(1)};

  .claimed-by-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${getSpacing(1)};

    .claimed-by-info,
    .profile-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
`;
