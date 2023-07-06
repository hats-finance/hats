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
  gap: ${getSpacing(2)};
  border: 1px solid var(--grey-700);
  padding: ${getSpacing(2.5)} ${getSpacing(2)};

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
    }

    .hacker-details {
      color: var(--grey-400);
      display: flex;
      align-items: center;

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
`;
