import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { VaultNftRewardCardProps } from "./VaultNftRewardCard";

const getSize = (type: VaultNftRewardCardProps["type"]) => {
  if (type === "small") {
    return "140px";
  } else if (type === "normal") {
    return "180px";
  } else if (type === "tiny") {
    return "60px";
  }
};

export const StyledVaultNftRewardCard = styled.div<{ type: VaultNftRewardCardProps["type"] }>(
  ({ type }) => css`
    display: flex;
    flex-direction: column;

    .nft-asset {
      border: 1px solid var(--grey-600);
      padding: ${type === "tiny" ? "1px" : getSpacing(1)};
      position: relative;
      cursor: pointer;
      transition: 0.2s;
      width: ${getSize(type)};
      height: ${getSize(type)};
      aspect-ratio: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        opacity: 0.8;
      }

      ${type === "with_description" &&
      css`
        padding: 0;
        border-color: var(--primary-light);
        width: 100%;
        height: 290px;
      `}

      .preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .icon {
        position: absolute;
        bottom: ${type === "tiny" ? "2px" : getSpacing(1.5)};
        right: ${type === "tiny" ? "2px" : getSpacing(1.5)};
      }
    }

    .nft-description {
      flex: 1;
      border: 1px solid var(--primary-light);
      padding: ${getSpacing(3)} ${getSpacing(2)};
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(2)};

      p.details {
        overflow: hidden;
        display: -webkit-box;
        line-clamp: 5;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
      }

      .name {
        font-weight: 700;
        font-size: var(--xsmall);
      }
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

        &.capitalize {
          text-transform: capitalize;
        }

        img {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
`;
