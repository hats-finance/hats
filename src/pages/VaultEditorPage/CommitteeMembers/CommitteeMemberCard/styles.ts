import styled from "styled-components";

export const StyledCommitteeMemberCard = styled.div`
  .member-details {
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
      flex: 1 0 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    &__inputs {
      width: 60%;
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
