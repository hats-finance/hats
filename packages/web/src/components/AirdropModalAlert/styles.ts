import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledAirdropModalAlert = styled.div`
  width: 420px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .image {
    border-radius: 500px;
    overflow: hidden;
    border: 1px solid var(--primary);
    width: 70%;
    margin-bottom: ${getSpacing(4)};
    margin-top: ${getSpacing(4)};

    img {
      width: 100%;
    }
  }

  h3 {
    font-size: var(--moderate-big);
    margin-bottom: ${getSpacing(1)};
  }

  h4 {
    font-size: var(--moderate);
    margin-bottom: ${getSpacing(2)};
  }

  p {
    margin-bottom: ${getSpacing(6)};
  }
`;
