import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSubmissionsListPage = styled.div`
  position: relative;
  background: var(--background-2);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(6)};

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
  }
`;

export const StyledSubmissionCard = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: ${getSpacing(3)};
  border: 1px solid var(--grey-700);
  padding: ${getSpacing(2)} ${getSpacing(3)};
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    border-color: var(--secondary);
    background: var(--background-3);

    .details {
      opacity: 1;
    }
  }

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
  }

  .details {
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
`;
