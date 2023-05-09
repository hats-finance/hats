import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { NftPreviewProps } from "./NftPreview";

const getSize = (size: NftPreviewProps["size"]) => {
  if (size === "small") {
    return "140px";
  } else if (size === "normal") {
    return "180px";
  }
};

export const StyledNftPreview = styled.div<{ size: NftPreviewProps["size"] }>(
  ({ size }) => css`
    border: 1px solid var(--grey-600);
    padding: ${getSpacing(1)};
    position: relative;
    cursor: pointer;
    transition: 0.2s;
    width: ${getSize(size)};
    aspect-ratio: 1;
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
  `
);

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
    flex-direction: column;
    gap: ${getSpacing(3)};

    .first {
      display: flex;
      justify-content: space-between;
    }

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
