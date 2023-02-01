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

  span {
    padding-left: ${getSpacing(1)};
  }

  input {
    display: none;
  }
`;
