import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultAssetForm = styled.div`
  .inputs {
    display: flex;
    gap: ${getSpacing(3)};
  }

  .chain {
    min-width: 260px;
  }
`;
