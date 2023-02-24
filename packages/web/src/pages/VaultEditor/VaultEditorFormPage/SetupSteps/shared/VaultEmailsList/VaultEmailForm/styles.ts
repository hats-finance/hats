import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultEmail = styled.div`
  display: flex;

  & > :nth-child(1) {
    width: calc(100% - 160px);
  }

  & > :nth-child(2) {
    width: 160px;
    display: flex;
    justify-content: center;
  }

  &:not(:last-of-type) {
    margin-bottom: ${getSpacing(2)};
  }

  .multiple-buttons {
    display: flex;
    gap: ${getSpacing(1)};
  }
`;
