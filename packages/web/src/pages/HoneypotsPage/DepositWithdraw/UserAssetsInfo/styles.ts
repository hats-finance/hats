import { breakpointsDefinition } from "styles/breakpoints.styles";
import styled from "styled-components";

export const StyledUserAssetsInfoTable = styled.table`
  width: 100%;
  color: var(--white);
  margin: 30px 0;
  max-height: 200px;
  overflow-y: scroll;
  /* padding: 0px 40px; */
  white-space: nowrap;

  @media (max-width: ${breakpointsDefinition.mobile}) {
    font-size: var(--xxsmall);
    padding: unset;
  }

  th {
    border-bottom: 1px solid var(--gray);
    text-align: left;
    position: sticky;
    top: 0px;
    background-color: var(--field-blue);
    padding: 10px;
  }

  td {
    padding: 10px;
    background-color: unset;
  }

  .withdraw-status-column {
    width: 100%;
    text-align: center;
    white-space: nowrap;
  }

  .token-symbol {
    font-weight: bold;
  }

  .withdraw-status-data {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .apy-column {
    display: flex;
    align-items: center;

    .info-icon {
      display: flex;
      margin-left: 10px;
    }
  }
`;
