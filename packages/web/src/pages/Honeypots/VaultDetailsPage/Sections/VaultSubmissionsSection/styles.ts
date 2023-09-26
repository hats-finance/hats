import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSubmissionsSection = styled.div`
  padding-bottom: ${getSpacing(10)};

  .public-submissions {
    margin-top: ${getSpacing(3)};
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(3)};
  }
`;
