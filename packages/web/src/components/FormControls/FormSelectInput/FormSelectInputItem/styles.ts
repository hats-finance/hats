import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledFormSelectInputItem = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${getSpacing(1)};
  padding: ${getSpacing(2)};
  user-select: none;
  color: var(--white);
  font-size: var(--xsmall);

  &:hover {
    background-color: var(--background-2);
  }

  .info {
    display: flex;
    align-items: center;
    gap: ${getSpacing(1)};
    text-transform: capitalize;

    img {
      width: ${getSpacing(3.8)};
      height: ${getSpacing(3.8)};
      object-fit: contain;
    }

    span {
      padding-left: ${getSpacing(1)};
    }
  }

  input {
    display: none;
  }
`;
