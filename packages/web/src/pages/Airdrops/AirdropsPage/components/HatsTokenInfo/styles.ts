import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledHatsTokenInfo = styled.div`
  .hats-vision {
    display: flex;
    justify-content: space-between;
    gap: ${getSpacing(6)};

    @media (max-width: ${breakpointsDefinition.mobile}) {
      flex-direction: column;
      align-items: center;
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
      }
    }
  }

  .hats-utility {
    margin-top: ${getSpacing(12)};

    .utilities {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: ${getSpacing(3)};
      padding-top: ${getSpacing(6)};

      @media (max-width: ${breakpointsDefinition.mediumMobile}) {
        grid-template-columns: 1fr;
      }

      .utility {
        display: flex;
        flex-direction: column;
        gap: ${getSpacing(2)};
        padding: ${getSpacing(4)} ${getSpacing(5)};
        background: linear-gradient(180deg, #231e51 0%, #0e0e18 23.26%);
        transition: 0.2s;

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
          font-size: var(--xsmall);
        }
      }
    }
  }
`;
