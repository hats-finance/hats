import styled from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledContractCoveredForm = styled.div`
  background: var(--background-3);
  border-radius: 4px;
  padding: ${getSpacing(2.5)};

  &:not(:last-of-type) {
    padding-bottom: ${getSpacing(3)};
    margin-bottom: ${getSpacing(3)};
  }

  .contract {
    width: 100%;

    .subcontent {
      display: flex;
      justify-content: space-between;
      gap: ${getSpacing(3)};
    }

    .flex {
      display: flex;
      align-items: baseline;
      gap: ${getSpacing(2)};
    }
  }

  .w-40 {
    width: 40%;

    @media (max-width: ${breakpointsDefinition.smallMobile}) {
      width: 100%;
    }
  }
`;
