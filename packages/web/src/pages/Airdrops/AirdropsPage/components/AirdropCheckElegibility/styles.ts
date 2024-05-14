import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledAirdropCheckElegibility = styled.div`
  border: 1px solid var(--primary-light);
  padding: ${getSpacing(4)};
  display: flex;
  flex-direction: column;
  margin-bottom: ${getSpacing(8)};

  h2.underline {
    border-bottom: 1px solid var(--primary-light);
    padding-bottom: ${getSpacing(1)};
    margin-bottom: ${getSpacing(3)};
    display: flex;
    align-items: center;
    gap: ${getSpacing(1)};

    &.selectable {
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        color: var(--primary);
      }
    }
  }

  .buttons {
    display: flex;
    gap: ${getSpacing(2)};
    align-self: flex-end;
  }
`;
