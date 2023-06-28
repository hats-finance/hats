import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledSetupReview = styled.div`
  .next-step {
    .title {
      display: flex;
      align-items: center;
      text-transform: uppercase;
      color: var(--white);
      font-weight: 700;
      margin-bottom: ${getSpacing(1)};
    }

    .helper-text {
      margin-left: ${getSpacing(3.5)};
    }
  }
`;

export const StyledPreviewModal = styled.div`
  width: calc(100vw - 64px - ${getSpacing(6)});
  height: calc(100vh - 64px - ${getSpacing(6)});

  @media (max-width: ${breakpointsDefinition.smallMobile}) {
    width: calc(100vw - 64px - ${getSpacing(2)});
    height: calc(100vh - 64px - ${getSpacing(2)});
  }
`;
