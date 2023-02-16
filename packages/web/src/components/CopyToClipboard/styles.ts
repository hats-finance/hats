import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledCopyToClipboard = styled.div`
  .copy-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${getSpacing(4)};
    height: ${getSpacing(4)};
    padding: ${getSpacing(1)};
    font-size: var(--xsmall);
    background: var(--grey-700);
    border-radius: ${getSpacing(0.5)};
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }
`;
