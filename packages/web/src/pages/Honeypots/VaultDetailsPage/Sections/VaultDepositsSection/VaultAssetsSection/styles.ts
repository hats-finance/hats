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

    .action-button {
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      grid-template-columns: 1fr 1fr 1fr;
      gap: ${getSpacing(3)};
      padding: ${getSpacing(0)} ${getSpacing(1)};

      .last {
        display: none;
      }

      .action-button {
        justify-content: center;
        grid-column-start: 1;
        grid-column-end: 4;
      }
    }
  }

  .header {
    font-weight: 700;
  }
`;
