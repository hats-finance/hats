import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledVaultFormReview = styled.div`
  .description {
    color: var(--white);
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
