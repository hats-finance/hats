import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { IHackerProfileImageProps } from "./HackerProfileImage";

const getSize = (size: IHackerProfileImageProps["size"]) => {
  switch (size) {
    case "xxsmall":
      return 3.4;
    case "xsmall":
      return 4;
    case "small":
      return 10;
    case "medium":
      return 14;
    case "large":
      return 18;
    default:
      return 10;
  }
};

export const StyledHackerProfileImage = styled.div<{ size: IHackerProfileImageProps["size"]; noMargin: boolean }>(
  ({ size, noMargin }) => css`
    width: ${size === "fit" ? "100%" : getSpacing(getSize(size))};
    height: ${size === "fit" ? "100%" : getSpacing(getSize(size))};
    margin-bottom: ${noMargin || size === "fit" ? 0 : getSpacing(4)};

    ${size === "fit" &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
    `}

    .avatar-preview {
      width: 100%;
      height: 100%;
      object-fit: ${size === "fit" ? "cover" : "contain"};
      border-radius: 100px;
    }

    canvas {
      border-radius: 100px;
      width: ${getSpacing(getSize(size))} !important;
      height: ${getSpacing(getSize(size))} !important;
    }
  `
);
