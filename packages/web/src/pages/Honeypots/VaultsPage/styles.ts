import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultsPage = styled.div`
  h2.subtitle {
    display: flex;
    align-items: center;
    gap: ${getSpacing(2)};
  }

  .vaults-container {
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(2.5)};
    margin-bottom: ${getSpacing(8)};
  }
`;
