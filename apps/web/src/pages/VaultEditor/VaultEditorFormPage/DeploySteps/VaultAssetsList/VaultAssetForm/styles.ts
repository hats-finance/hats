import { getSpacing } from "styles";
import styled from "styled-components";

export const StyledVaultAssetForm = styled.div`
  .inputs {
    display: flex;
    gap: ${getSpacing(3)};

    & > div:first-child {
      min-width: 220px;
    }
  }
`;
