import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledVaultAssetsSection = styled.div`
  display: flex;
  flex-direction: column;

  .header,
  .row {
    display: grid;
    grid-template-columns: 2fr 2fr 2fr 100px;
    align-items: center;
    gap: ${getSpacing(1)};
    padding: ${getSpacing(0)} ${getSpacing(2)};

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      grid-template-columns: 1fr 1fr 1fr 100px;
      padding: ${getSpacing(0)} ${getSpacing(1)};
    }

    .action-button {
      display: flex;
      justify-content: flex-end;
    }
  }

  .header {
    font-weight: 700;
  }
`;
