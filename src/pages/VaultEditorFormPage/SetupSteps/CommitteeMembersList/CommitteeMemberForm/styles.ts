import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledCommitteeMemberForm = styled.div`
  background: var(--background-clearer-blue);
  border-radius: 4px;
  padding: ${getSpacing(2.5)};

  &:not(:last-of-type) {
    padding-bottom: ${getSpacing(3)};
    margin-bottom: ${getSpacing(3)};
  }

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
        width: 100%;
        display: flex;
        gap: 0 ${getSpacing(2)};
        margin-bottom: ${getSpacing(3)};

        @media (max-width: ${breakpointsDefinition.smallMobile}) {
          flex-direction: column;
        }
      }

      .pgp-keys {
        width: 100%;
        margin-bottom: ${getSpacing(3)};

        &__item {
          display: flex;
          align-items: center;

          &:not(:last-of-type) {
            margin-bottom: ${getSpacing(3)};
          }
        }
      }
    }
  }
`;
