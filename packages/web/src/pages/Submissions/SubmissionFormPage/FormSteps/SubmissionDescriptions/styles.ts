import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledSubmissionDescriptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(2)};
  margin-bottom: ${getSpacing(2)};

  .buttons {
    display: flex;
    justify-content: space-between;
  }
`;

export const StyledSubmissionDescription = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--white);
  padding: ${getSpacing(3)} ${getSpacing(2.5)};
  background: var(--background-3);
  border-radius: 4px;

  .row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: ${getSpacing(2)};

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }

  p.bold {
    font-weight: 700;
    text-transform: uppercase;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
  }
`;
