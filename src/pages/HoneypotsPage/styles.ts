import { breakpointsDefinition } from "../../styles/breakpoints.styles";
import styled from "styled-components";

export const StyledHoneypotsPage = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  .search-cell {
    .search-wrapper {
      display: flex;

      .search-input {
        background-color: transparent;
        border: none;
        color: var(--white);
        width: 100%;
        margin-left: 10px;
      }
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    max-width: var(--element-max-width);
    margin-bottom: 150px;

    @media (max-width: ${breakpointsDefinition.mobile}) {
      margin-bottom: 50px;
    }

    tr {
      text-align: center;
    }

    th {
      background-color: var(--blue);
      padding: 20px;
      color: var(--white);

      &:nth-child(2) {
        text-align: left;
      }
    }

    .transparent-row {
      color: var(--white);

      td {
        background-color: transparent;
        text-align: left;
        padding-left: 0;

        @media (max-width: ${breakpointsDefinition.mobile}) {
          padding-left: 20px;
        }
      }
    }
  }
`;
