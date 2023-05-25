import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

type ISectionTypes = "submission" | "fix" | "rewards" | "alert" | "invisible";

const getColorBySectionType = (type: ISectionTypes) => {
  switch (type) {
    case "submission":
      return "var(--warning-yellow)";
    case "fix":
      return "var(--error-red)";
    case "rewards":
      return "var(--secondary)";
    case "alert":
      return "var(--error-red)";
    case "invisible":
      return "transparent";
  }
};

export const StyledSubmissionTermsAndProcess = styled.div`
  color: var(--white);

  .buttons {
    display: flex;
    justify-content: flex-end;
  }
`;

export const StyledTermsSection = styled.div<{ type: ISectionTypes }>(
  ({ type }) => css`
    margin: ${getSpacing(4)} 0;

    .section-title {
      color: var(--blue);
      font-weight: bold;
      padding: ${getSpacing(1.5)} ${getSpacing(3)};
      background-color: ${getColorBySectionType(type)};
    }

    .section-content {
      border: 1px solid ${getColorBySectionType(type)};
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

        &.small-margin-top {
          margin-top: ${getSpacing(2)};
        }
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

      a {
        text-transform: uppercase;
        text-decoration: underline;
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
