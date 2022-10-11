import styled from "styled-components";

export const StyledVaultDetails = styled.div`
  display: flex;
  flex-wrap: wrap;

  .inputs, .icons {
    width: 50%;
  }

  .icons {
    display: flex;
    justify-content: flex-end;

    &__input {
        margin-left: 30px;
    }
  }
`;
