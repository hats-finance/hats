import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledSubmissionsListPage = styled.div`
  position: relative;
  background: var(--background-2);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(14)};

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${getSpacing(5)};

    .title {
      display: flex;
      align-items: center;
      font-size: var(--moderate);

      p {
        margin-left: ${getSpacing(1)};

        span {
          font-weight: 700;
        }
      }
    }
  }

  .submissions-list {
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(1.5)};

    .group {
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(1.5)};

      &:not(:last-child) {
        margin-bottom: ${getSpacing(3)};
      }

      .group-date {
        color: var(--grey-500);
        font-weight: 700;
      }
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${getSpacing(3)};

    .controls,
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: ${getSpacing(4)};

      .selection,
      .rescan,
      .date-sort {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: ${getSpacing(0.5)};
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          opacity: 0.7;
        }
      }

      .severity-filter {
        width: ${getSpacing(25)};
      }

      .selection {
        display: flex;
        align-items: center;

        .icon {
          font-size: var(--medium);
        }
      }
    }

    .pagination {
      gap: ${getSpacing(2)};
    }
  }

  .pages {
    display: flex;
    align-items: center;
    gap: ${getSpacing(1.5)};
    justify-content: center;

    p,
    .icon {
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        opacity: 0.7;
      }

      &.current {
        font-weight: 700;
        color: var(--secondary);
        text-decoration: underline;
      }
    }
  }

  .buttons {
    display: flex;
    gap: ${getSpacing(5)};
    justify-content: space-between;
    align-items: center;
    margin-top: ${getSpacing(3)};
    background: var(--brackground-2);
    backdrop-filter: blur(2px);
    position: fixed;
    bottom: 0;
    padding: ${getSpacing(0)} ${getSpacing(3)} ${getSpacing(4)};
    transform: translateX(-${getSpacing(3)});
  }
`;

export const StyledSubmissionCard = styled.div<{ noActions: boolean; inPayout: boolean; isChecked: boolean }>(
  ({ noActions, inPayout, isChecked }) => css`
    display: flex;
    position: relative;
    border: 1px solid var(--grey-700);

    ${inPayout &&
    css`
      border: none;
      width: 100%;
    `}

    ${!noActions &&
    css`
      ${!inPayout &&
      css`
        cursor: pointer;
      `}
      transition: 0.2s;

      &:hover {
        border-color: var(--grey-500);

        ${isChecked &&
        css`
          border-color: var(--secondary);
        `}

        .content-container .details {
          opacity: 1;
        }
      }
    `}

    ${isChecked &&
    css`
      border-color: var(--secondary);
      background: var(--background-3);
    `}

    .select-check {
      padding: ${getSpacing(2)} 0 0 ${getSpacing(2)};
      font-size: var(--medium);
    }

    .content-container {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
      padding: ${getSpacing(2)} ${getSpacing(3)};
      gap: ${getSpacing(3)};

      ${inPayout &&
      css`
        padding: 0;

        .severity {
          display: none;
        }
      `}

      img {
        width: ${getSpacing(5)};
        height: ${getSpacing(5)};
        object-fit: cover;
        border-radius: 50%;
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: ${getSpacing(0.5)};

        .submission-title {
          font-weight: 700;
          padding-left: ${getSpacing(2)};
          margin-top: ${getSpacing(0.5)};
        }

        .hacker-details {
          color: var(--grey-400);
          display: flex;
          align-items: center;
          padding-left: ${getSpacing(2)};

          > * {
            padding: 0 ${getSpacing(1)};

            &:first-child {
              padding-left: 0;
            }

            &:not(:last-child) {
              border-right: 1px solid var(--grey-400);
            }
          }
        }
      }

      .date {
        position: absolute;
        top: ${getSpacing(2)};
        right: ${getSpacing(3)};
        font-size: var(--xxsmall);
        color: var(--grey-400);

        ${inPayout &&
        css`
          display: none;
        `}
      }

      .details {
        cursor: pointer;
        opacity: 0;
        display: flex;
        align-items: center;
        gap: ${getSpacing(1)};
        position: absolute;
        bottom: ${getSpacing(2)};
        right: ${getSpacing(3)};
        font-size: var(--xxsmall);
        color: var(--secondary);
        font-weight: 700;
        transition: 0.2s;
      }
    }
  `
);
