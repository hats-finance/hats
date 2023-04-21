import { getSpacing } from "styles";
import styled from "styled-components";

export const StyledFormSelectInputItem = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${getSpacing(1)};
  padding: ${getSpacing(2)} ${getSpacing(1.5)};
  user-select: none;
  color: var(--white);

  &:hover {
    background-color: var(--moderate-blue);
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
