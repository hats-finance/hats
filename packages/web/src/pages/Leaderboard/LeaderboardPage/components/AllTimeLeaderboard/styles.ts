import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledAllTimeLeaderboard = styled.div`
  .leaderboard-table {
    display: grid;
    grid-template-columns: repeat(5, auto);

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      overflow-x: auto;
    }

    .header,
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: ${getSpacing(3)} ${getSpacing(1)};
      font-family: "IBM Plex Mono", monospace;
      text-align: center;
    }

    .content {
      position: relative;
      border-top: 1px solid var(--primary-light);
      display: flex;
      align-items: center;
      gap: ${getSpacing(1)};

      &.prize {
        font-weight: 700;
      }

      &.streak {
        grid-column: 1 / 6;
        border-top: none;
        padding-top: 0;
      }

      .address {
        display: flex;
        align-items: center;
        gap: ${getSpacing(1)};

        &.profile {
          transition: 0.1s ease-in-out;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
            color: var(--secondary);
          }
        }
      }

      .findings-breakdown {
        display: none;
        grid-template-columns: repeat(2, auto);
        align-items: center;
        gap: ${getSpacing(2)};
        position: absolute;
        background: var(--background-2);
        border: 1px solid var(--primary);
        padding: ${getSpacing(1.5)} ${getSpacing(2)};
        transform: translateY(-110%);
        top: 25%;
        z-index: 20;

        &::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%) translateY(50%) rotate(180deg);
          border: 10px solid transparent;
          border-bottom: 10px solid var(--primary);
        }

        &.show {
          display: grid;

          @media (max-width: ${breakpointsDefinition.smallMobile}) {
            display: none;
          }
        }

        .breakdown-severity {
          display: flex;
          align-items: center;
          gap: ${getSpacing(1)};

          .logos {
            display: flex;
            align-items: center;

            img {
              width: 24px;
              height: 24px;

              &:not(:first-child) {
                margin-left: -10px;
              }
            }
          }
        }

        .breakdown-prize {
          width: 100px;
        }
      }
    }
  }
`;
