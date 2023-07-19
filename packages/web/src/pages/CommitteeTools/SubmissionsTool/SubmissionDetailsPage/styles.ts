import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSubmissionDetailsPage = styled.div`
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
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        opacity: 0.8;
      }

      p {
        margin-left: ${getSpacing(1)};

        span {
          font-weight: 700;
        }
      }
    }
  }

  .submission-content {
    white-space: normal;
    font-size: var(--xsmall);
    background: var(--background-3);
    padding: ${getSpacing(3)} ${getSpacing(4)};
    color: var(--white);
    margin-top: ${getSpacing(2)};
    border-radius: ${getSpacing(0.5)};
  }

  .buttons {
    margin-top: ${getSpacing(3)};
  }
`;
