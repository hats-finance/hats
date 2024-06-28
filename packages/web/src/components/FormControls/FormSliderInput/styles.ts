import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledFormSliderInput = styled.div`
  margin-bottom: ${getSpacing(8)};

  .mark {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${getSpacing(0.5)};
    margin-top: ${getSpacing(1.5)};

    .line {
      background-color: white;
      height: 12px;
      width: 3px;
      border-radius: 50px;
    }

    p {
      color: white;
      font-weight: 700;
    }
  }
`;
