import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledScopeReposInformation = styled.div`
  .repos-information {
    margin-top: ${getSpacing(2)};

    .repo {
      .toggle {
        width: 100%;
        margin-bottom: ${getSpacing(1)};
      }

      .flex {
        display: flex;
        align-items: baseline;
        gap: ${getSpacing(2)};
      }

      .commitHashes {
        width: 100%;
      }
    }
  }
`;
