import styled from "styled-components";

export const StyledContractCoveredCard = styled.div`
  .contract {
    display: flex;
    align-items: flex-start;

    &__number {
      flex-shrink: 0;
      color: var(--white);
      width: 40px;
      height: 40px;
      margin-top: 24px;
      margin-right: 14px;
      margin-bottom: 24px;
      border: 1px solid var(--turquoise);
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }

    &__content {
      width: 65%;
    }

    &__subcontent {
      display: flex;
      justify-content: space-between;

      &__name {
        width: 60%;
      }

      &__severities {
        width: 35%;
      }
    }
  }

  .controller-buttons {
    button {
      margin: 0;
      margin-left: 54px;
      margin-bottom: 30px;
      padding-left: 25px;
      padding-right: 25px;
    }
  }
`;
