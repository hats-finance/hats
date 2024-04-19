import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledAirdropRedeemModal = styled.div`
  width: 440px;
  max-width: 100%;

  .content-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: ${getSpacing(2)};
    padding: 0 ${getSpacing(1)};

    img.banner {
      margin: 0 auto;
      width: ${getSpacing(24)};
      margin-bottom: ${getSpacing(5)};
    }

    h2 {
      text-align: center;
      margin-bottom: ${getSpacing(4)};
    }

    p {
      margin-top: ${getSpacing(2)};
    }

    ol {
      margin-top: ${getSpacing(2)};
      padding-left: ${getSpacing(2.5)};

      li {
        margin-top: ${getSpacing(1)};
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: ${getSpacing(6)} 0 ${getSpacing(2)};

      &.center {
        justify-content: center;
      }
    }
  }
`;
