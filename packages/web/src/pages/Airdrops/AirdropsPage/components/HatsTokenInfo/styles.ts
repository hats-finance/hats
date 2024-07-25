import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledHatsTokenInfo = styled.div`
  .hats-vision {
    display: flex;
    justify-content: center;
    text-align: center;
    gap: ${getSpacing(6)};

    @media (max-width: ${breakpointsDefinition.mobile}) {
      flex-direction: column;
      align-items: center;
      margin-top: ${getSpacing(5)};
    }

    h1 {
      font-size: var(--large);
    }

    .info {
      width: 50%;
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(2)};
      padding-top: ${getSpacing(4)};

      @media (max-width: ${breakpointsDefinition.mobile}) {
        width: 100%;
      }

      h3 {
        font-size: var(--medium);
      }

      p {
        font-size: var(--small);
        line-height: 1.5;
      }
    }
  }

  .hats-utility {
    margin-top: ${getSpacing(20)};

    @media (max-width: ${breakpointsDefinition.mobile}) {
      margin-top: ${getSpacing(10)};
    }

    h1 {
      font-size: var(--large);
    }

    p {
      line-height: 1.5;
    }

    .text-info {
      font-size: var(--small);
    }

    .utilities {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: ${getSpacing(7)};
      padding-top: ${getSpacing(6)};

      @media (max-width: ${breakpointsDefinition.mediumMobile}) {
        grid-template-columns: 1fr;
      }

      .utility {
        display: flex;
        flex-direction: column;
        gap: ${getSpacing(2)};
        padding: ${getSpacing(4)} ${getSpacing(7)};
        background: linear-gradient(180deg, #231e51 0%, #0e0e18 23.26%);
        transition: 0.2s;
        font-size: var(--small);
        line-height: 1.4;

        &:hover {
          background: linear-gradient(180deg, #231e51 0%, #0e0e18 114.05%);
        }

        img {
          align-self: center;
        }

        h3 {
          font-size: var(--small);
        }

        p {
          font-size: var(--small);
        }
      }
    }
  }

  .hats-allocation {
    margin-top: ${getSpacing(25)};
    display: flex;
    flex-direction: column;
    align-items: center;

    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      h1 {
        font-size: var(--large);
      }

      .distribution {
        font-size: var(--small);
        background: var(--secondary);
        color: var(--background);
        border-radius: 20px 0 0 20px;
        padding: ${getSpacing(1)} ${getSpacing(4)};
        text-transform: uppercase;
        font-family: "IBM Plex Mono", monospace;
      }
    }

    h3 {
      font-size: var(--small);
    }

    img {
      &.chart {
        width: 70%;
        margin-top: ${getSpacing(8)};

        @media (max-width: ${breakpointsDefinition.mobile}) {
          width: 95%;
        }
      }

      &.table {
        width: 100%;
        margin-top: ${getSpacing(16)};

        @media (max-width: ${breakpointsDefinition.mobile}) {
          margin-top: ${getSpacing(10)};
        }
      }
    }
  }
`;
