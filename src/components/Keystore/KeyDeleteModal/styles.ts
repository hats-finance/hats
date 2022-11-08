import styled from "styled-components";

export const StyledKeyDeleteModal = styled.div`
    .description {
      margin-bottom: 50px;
    }
    .button-container {
      display: flex;
      justify-content: space-between;
      button {
        width: 40%;
      }
    }
    .button-cancel {
      background-color: transparent !important;
      border: 1px solid $turquoise;
      color: $turquoise;
    }
`;
