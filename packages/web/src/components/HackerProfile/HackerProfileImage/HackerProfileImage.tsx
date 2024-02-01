import { IHackerProfile } from "@hats.finance/shared";
import Identicon from "react-identicons";
import { ipfsTransformUri } from "utils";
import { StyledHackerProfileImage } from "./styles";

export type IHackerProfileImageProps = {
  hackerProfile?: IHackerProfile;
  size?: "xsmall" | "small" | "medium" | "large";
  noMargin?: boolean;
};

export const HackerProfileImage = ({ hackerProfile, size = "medium", noMargin = false }: IHackerProfileImageProps) => {
  const getProfileAvatar = () => {
    if (!hackerProfile) return null;

    if (hackerProfile.avatar)
      return (
        <img
          className="avatar-preview"
          src={hackerProfile._id ? ipfsTransformUri(hackerProfile.avatar, { isPinned: true }) : hackerProfile.avatar}
          alt="avatar"
        />
      );

    if (hackerProfile.github_username)
      return (
        <img
          className="avatar-preview"
          src={`https://github.com/${hackerProfile.github_username}.png`}
          alt="avatar directly from github"
        />
      );

    return (
      <div className="mb-5">
        <Identicon string={hackerProfile.username} bg="#fff" />
      </div>
    );
  };

  return (
    <StyledHackerProfileImage size={size} noMargin={noMargin}>
      {getProfileAvatar()}
    </StyledHackerProfileImage>
  );
};
