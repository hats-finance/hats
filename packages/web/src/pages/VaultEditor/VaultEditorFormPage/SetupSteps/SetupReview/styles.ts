import { getSpacing } from "styles";
import styled from "styled-components";

export const StyledSetupReview = styled.div`
  .next-step {
    .title {
      display: flex;
      align-items: center;
      text-transform: uppercase;
      color: var(--white);
      font-weight: 700;
      margin-bottom: ${getSpacing(1)};
    }

    .helper-text {
      margin-left: ${getSpacing(3.5)};
    }
  }

  .preview-vault {
    margin-top: ${getSpacing(5)};
    border: 1px solid var(--turquoise);
    box-sizing: border-box;

    table {
      width: 100%;
      border-collapse: collapse;
    }
  }
`;
