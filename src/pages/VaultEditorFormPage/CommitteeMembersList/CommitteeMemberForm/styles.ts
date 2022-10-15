import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledCommitteeMemberForm = styled.div`
  .member-details {
    display: flex;
    align-items: flex-start;

    .index-number {
      flex-shrink: 0;
      color: var(--white);
      width: 40px;
      height: 40px;
      margin-top: 28px;
      margin-right: 14px;
      margin-bottom: 24px;
      border: 1px solid var(--turquoise);
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }

    .content {
      flex: 1 0 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      @media (max-width: ${breakpointsDefinition.mobile}) {
        flex-direction: column;
      }

      .inputs {
        width: 60%;

        @media (max-width: ${breakpointsDefinition.mobile}) {
          width: 100%;
        }
      }
    }
  }

  .controller-buttons {
    @media (max-width: ${breakpointsDefinition.mobile}) {
      margin-top: ${getSpacing(3)};
    }

    button {
      margin: 0;
      margin-left: 54px;
      margin-bottom: 30px;
      padding-left: 25px;
      padding-right: 25px;
    }
  }
`;
