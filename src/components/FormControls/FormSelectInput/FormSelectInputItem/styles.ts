import { getSpacing } from "styles";
import styled from "styled-components";

export const StyledFormSelectInputItem = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${getSpacing(1)};
  padding: ${getSpacing(1)} ${getSpacing(1.5)};
  user-select: none;
  border: 1px solid var(--turquoise);
  font-weight: 700;

  &:hover {
    background-color: var(--moderate-blue);
  }

  span {
    padding-left: ${getSpacing(1)};
  }
`;
