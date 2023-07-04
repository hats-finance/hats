import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSubmissionsListPage = styled.div`
  position: relative;
  background: var(--background-2);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(6)};

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${getSpacing(5)};

    .title {
      display: flex;
      align-items: center;
      font-size: var(--moderate);

      p {
        margin-left: ${getSpacing(1)};

        span {
          font-weight: 700;
        }
      }
    }
  }
`;
