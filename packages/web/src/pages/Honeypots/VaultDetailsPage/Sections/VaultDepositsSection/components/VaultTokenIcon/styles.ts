import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultTokenIcon = styled.div`
  display: flex;
  align-items: center;
  gap: ${getSpacing(2.5)};
  font-weight: 700;

  .images {
    position: relative;
    width: ${getSpacing(5.5)};
    height: ${getSpacing(5.5)};

    img.logo {
      width: ${getSpacing(5.5)};
      height: ${getSpacing(5.5)};
      object-fit: contain;
      border-radius: 500px;
    }

    img.chain {
      width: ${getSpacing(3)};
      height: ${getSpacing(3)};
      object-fit: contain;
      position: absolute;
      bottom: -2px;
      right: -10px;
    }
  }
`;
