import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledCommitteeMemberForm = styled.div`
  position: relative;
  background: var(--background-3);
  border-radius: 4px;
  padding: ${getSpacing(2.5)};

  &:not(:last-of-type) {
    padding-bottom: ${getSpacing(3)};
    margin-bottom: ${getSpacing(3)};
  }

  .linkedMultisig {
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--grey-600);
    color: var(--grey-400);
    font-size: var(--tiny);
    border-radius: 5px;
    padding: ${getSpacing(0.4)} ${getSpacing(1.4)};
    position: absolute;
    transform: translateY(-50%);
    top: 0;

    &.outside {
      color: var(--red);
    }
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

      .title {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .multisig-info {
          color: var(--grey-400);

          span {
            display: flex;
            align-items: center;
            gap: ${getSpacing(1)};

            &.multisig-address {
              cursor: pointer;
              transition: 0.3s;

              &:hover {
                opacity: 0.7;
              }
            }

            &.multisig-outside {
              color: var(--error-red);
            }
          }
        }
      }

      .inputs {
        width: 100%;
        display: flex;
        align-items: flex-start;
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
          gap: ${getSpacing(1)};

          &:not(:last-of-type) {
            margin-bottom: ${getSpacing(3)};
          }
        }
      }
    }
  }
`;
