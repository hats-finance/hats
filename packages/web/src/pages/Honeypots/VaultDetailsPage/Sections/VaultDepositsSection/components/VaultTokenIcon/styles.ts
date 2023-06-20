import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultTokenIcon = styled.div`
  display: flex;
  align-items: center;
  gap: ${getSpacing(2)};

  .images {
    position: relative;
    width: ${getSpacing(4.5)};
    height: ${getSpacing(4.5)};

    img.logo {
      width: ${getSpacing(4.5)};
      height: ${getSpacing(4.5)};
      object-fit: contain;
      border-radius: 500px;
    }

    img.chain {
      width: ${getSpacing(2.8)};
      height: ${getSpacing(2.8)};
      object-fit: contain;
      position: absolute;
      bottom: -4px;
      right: -6px;
    }
  }
`;
