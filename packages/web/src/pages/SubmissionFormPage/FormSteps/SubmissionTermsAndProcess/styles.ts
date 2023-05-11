import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledSubmissionTermsAndProcess = styled.div`
  color: var(--white);

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;

    tr {
      th {
        text-align: left;
        padding: 20px;
        color: $dark-turquoise;
      }
      td {
        padding: 0 20px;

        > span {
          color: $dark-turquoise;
          font-weight: bold;
        }
      }
    }

    .nft-wrapper {
      cursor: pointer;
      display: flex;
      align-items: center;

      .media-wrapper {
        margin-right: 15px;

        .nft-wrapper__video {
          width: 50px;
          max-height: 350px;
        }
      }
    }
  }

  .warning-notice {
    border: 1px solid $red;
    padding: 30px 80px;
    margin: 30px 0;
  }
  .accept-terms-wrapper {
    display: flex;
    align-items: center;
    button {
      min-width: 150px;
    }
    .checkbox-container {
      input[type="checkbox"] {
        margin-right: 10px;
      }
    }
  }
`;

type ISectionTypes = "submission" | "fix" | "rewards";

const getColorBySectionType = (type: ISectionTypes) => {
  switch (type) {
    case "submission":
      return "--yellow";
    case "fix":
      return "--red";
    case "rewards":
      return "--dirty-turquoise";
  }
};

export const StyledTermsSection = styled.div<{ type: ISectionTypes }>(
  ({ type }) => css`
    margin: ${getSpacing(4)} 0;

    .section-title {
      color: var(--blue);
      font-weight: bold;
      padding: ${getSpacing(1.5)} ${getSpacing(3)};
      background-color: var(${getColorBySectionType(type)});
    }

    .section-content {
      border: 1px solid var(${getColorBySectionType(type)});
      padding: ${getSpacing(3)} ${getSpacing(6)};

      @media (max-width: ${breakpointsDefinition.mediumMobile}) {
        padding: ${getSpacing(2)} ${getSpacing(3)};
      }

      p {
        margin-bottom: ${getSpacing(2.5)};
      }

      p.title {
        font-weight: 700;
        text-transform: uppercase;
        margin-top: ${getSpacing(4)};
      }

      ul,
      ol {
        margin-top: ${getSpacing(1)};
        margin-bottom: ${getSpacing(2)};
        margin-left: ${getSpacing(4)};

        &.no-decoration {
          list-style: none;
        }

        li {
          margin-bottom: ${getSpacing(2)};

          &.align-center {
            display: flex;
            align-items: center;
          }

          img {
            margin-right: ${getSpacing(2)};
          }
        }
      }

      .rewards-list {
        margin-top: ${getSpacing(4)};
        display: flex;
        flex-direction: column;
        gap: 2px;

        .titles {
          display: flex;
          width: 100%;
          color: var(--turquoise);

          div {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 33%;
            padding: ${getSpacing(1.5)} 0;

            &:first-child {
              padding-left: ${getSpacing(4)};
            }

            &:last-child {
              padding-right: ${getSpacing(4)};
            }

            &:not(:first-child) {
              justify-content: center;
            }

            @media (max-width: ${breakpointsDefinition.mediumMobile}) {
              &:not(:last-child) {
                width: 40%;
              }

              &:last-child {
                width: 20%;
              }
            }
          }
        }
      }
    }
  `
);
