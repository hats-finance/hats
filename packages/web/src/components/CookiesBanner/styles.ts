import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledCookiesBanner = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${getSpacing(4)};
  padding: ${getSpacing(2)} ${getSpacing(3)};
  background: var(--background-2);
  position: fixed;
  bottom: 0;
  z-index: 3;

  .buttons {
    display: flex;
    gap: ${getSpacing(4)};

    @media (max-width: ${breakpointsDefinition.mediumMobile}) {
      flex-direction: column;
      align-items: center;
      gap: ${getSpacing(2)};
      width: ${getSpacing(25)};
    }
  }
`;
