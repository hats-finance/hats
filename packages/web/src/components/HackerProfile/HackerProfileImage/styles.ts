import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { IHackerProfileImageProps } from "./HackerProfileImage";

const getSize = (size: IHackerProfileImageProps["size"]) => {
  switch (size) {
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
    width: ${getSpacing(getSize(size))};
    height: ${getSpacing(getSize(size))};
    margin-bottom: ${noMargin ? 0 : getSpacing(4)};

    .avatar-preview {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 100px;
    }

    canvas {
      border-radius: 100px;
      width: ${getSpacing(getSize(size))} !important;
      height: ${getSpacing(getSize(size))} !important;
    }
  `
);
