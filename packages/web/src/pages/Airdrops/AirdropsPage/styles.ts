import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledAirdropsPage = styled.div`
  .hero {
    width: 100%;
    position: relative;
    margin-bottom: ${getSpacing(12)};

    @media (max-width: ${breakpointsDefinition.mobile}) {
      margin-bottom: ${getSpacing(2)};
    }

    video {
      width: 100%;

      &#airdrop-video {
        display: block;
      }

      &#airdrop-video-mobile {
        display: none;
      }

      @media (max-width: ${breakpointsDefinition.smallMobile}) {
        &#airdrop-video {
          display: none;
        }

        &#airdrop-video-mobile {
          display: block;
        }
      }
    }

    .buttons {
      position: absolute;
      bottom: 20%;
      left: 11.5%;

      @media (max-width: ${breakpointsDefinition.mediumMobile}) {
        bottom: 14%;
      }
    }
  }
`;
