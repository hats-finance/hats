import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledSubmissionProject = styled.div`
  position: relative;
  min-height: 50px;

  .table-wrapper {
    max-height: 500px;
    overflow: auto;

    table {
      width: 100%;
      border-collapse: collapse;

      tr {
        border-bottom: 2px solid var(--dark-blue);
      }

      th {
        color: var(--white);
        text-align: left;
        padding: 15px 25px;
        background-color: var(--field-blue);
        border-bottom: 1px solid var(--dark-turquoise);
        text-transform: uppercase;
      }

      td {
        padding: 15px 25px;

        @media (max-width: ${breakpointsDefinition.mobile}) {
          padding: 15px;
        }
      }
    }
  }

  .search-wrapper {
    display: flex;
    align-items: center;
    background-color: var(--field-blue);
    padding: 15px 30px;
    margin-bottom: 8px;

    input {
      background-color: transparent;
      border: none;
      width: 100%;
      color: var(--dark-turquoise);
      margin-left: 20px;
    }
  }

  .no-results {
    text-align: center;
    color: var(--dark-turquoise);
    margin-top: 15px;
  }
`;
