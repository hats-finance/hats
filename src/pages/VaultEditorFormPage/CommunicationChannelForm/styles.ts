import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledCommunicationChannelForm = styled.div`
  .description {
    color: var(--white);
  }

  .key-list {
    border: 1px solid var(--turquoise);
    padding: 20px;
    margin-bottom: 30px;

    .key-card {
      display: flex;
      align-items: center;

      .key-number {
        flex-shrink: 0;
        color: var(--white);
        width: 40px;
        height: 40px;
        margin-right: 24px;
        border: 1px solid var(--turquoise);
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }

      .key-content {
        flex: 1 0;
        color: var(--white);
        word-break: break-all;

        button {
          margin-bottom: 0 !important;
        }

        span {
          margin-right: 10px;
        }
      }
    }

    > div + div {
      margin-top: 20px;
    }
  }

  button {
    margin: 0;
    margin-bottom: 40px;
  }
`;

export const StyledHelper = styled.div`
  margin: 0 -20px 30px;
  padding: 20px;
  border: 1px solid var(--red);
  color: var(--white);

  @media (max-width: ${breakpointsDefinition.mobile}) {
    margin: 0 0 30px;
    padding: 20px;
    border: 1px solid var(--red);
    color: var(--white)
  }

  .hint-question {
    cursor: pointer;
    margin-top: 20px;

    img {
      margin-left: 10px;
    }
  }

  .hint-tooltip {
    margin-top: 8px;
    display: none;

    &.show {
      display: block;
    }
  }
`;
