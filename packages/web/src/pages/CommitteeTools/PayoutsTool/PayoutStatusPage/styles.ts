import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledPayoutStatusPage = styled.div`
  position: relative;
  background: var(--background-clear-blue);
  padding: ${getSpacing(3)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(6)};
  color: var(--white);

  .title-container {
    display: flex;
    justify-content: space-between;

    .title {
      display: flex;
      align-items: center;
      color: var(--white);
      font-size: var(--moderate);
      margin-bottom: ${getSpacing(5)};
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

  .section-title {
    color: var(--white);
    font-size: var(--small);
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: ${getSpacing(2)};
    padding-bottom: ${getSpacing(2)};
    border-bottom: 1px solid var(--grey-600);
  }
`;
