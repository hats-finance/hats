import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledDropdownSelector = styled.div`
  position: absolute;
  z-index: 100;
  padding: ${getSpacing(1)};
  top: calc(100% + ${getSpacing(1)});
  right: 0;
  background-color: var(--blue);
  width: 260px;
  border-radius: 2px;
  box-shadow: 2px 2px 4px black;

  .option {
    padding: ${getSpacing(1)};
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${getSpacing(1.5)};

    &:hover {
      background-color: var(--light-blue);
    }

    &:active {
      opacity: 0.7;
    }

    span {
      color: var(--white);
    }

    img {
      width: 20px;
    }
  }
`;
