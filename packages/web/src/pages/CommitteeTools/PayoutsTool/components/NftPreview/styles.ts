import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledNftPreview = styled.div`
  border: 1px solid var(--grey-600);
  padding: ${getSpacing(1)};
  position: relative;
  cursor: pointer;
  transition: 0.2s;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }

  .preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .icon {
    position: absolute;
    bottom: ${getSpacing(1.5)};
    right: ${getSpacing(1.5)};
  }
`;

export const StyledNFTDetailsModal = styled.div`
  max-width: 480px;
  color: var(--white);

  .big-preview {
    width: 100%;
  }

  .nft-name {
    font-size: var(--moderate);
    text-transform: uppercase;
    font-weight: 700;
  }

  .details {
    display: flex;
    gap: ${getSpacing(3)};

    .item {
      .title {
        font-size: var(--xxsmall);
        font-weight: 700;
        text-transform: uppercase;
      }

      .info {
        display: flex;
        align-items: center;
        gap: ${getSpacing(1)};
        margin-top: ${getSpacing(1)};

        img {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
`;
