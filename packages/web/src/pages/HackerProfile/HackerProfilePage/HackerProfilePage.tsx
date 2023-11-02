import ArrowIcon from "@mui/icons-material/ArrowBackOutlined";
import GitHubIcon from "assets/icons/social/github.icon";
import TwitterIcon from "assets/icons/social/twitter.icon";
import { Alert, Button, HackerProfileImage, Loading } from "components";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useProfileByUsername } from "../hooks";
import { StyledHackerProfilePage } from "./styles";

export const HackerProfilePage = () => {
  const { t } = useTranslation();
  const { username } = useParams();
  const navigate = useNavigate();

  const { data: profileFound, isLoading: isLoadingProfile } = useProfileByUsername(username);

  // If profile is not found
  if (profileFound === null) {
    return (
      <>
        <Alert type="error" content={t("HackerProfile.profileNotFoundError")} />
        <Button className="mt-4" onClick={() => navigate(-1)}>
          <ArrowIcon className="mr-2" /> {t("goBack")}
        </Button>
      </>
    );
  }

  return (
    <StyledHackerProfilePage className="content-wrapper">
      {profileFound && (
        <>
          <div className="profile-card">
            <HackerProfileImage noMargin hackerProfile={profileFound} size="large" />
            <div className="description">
              <h2>{profileFound.username}</h2>
              {profileFound.title && <p className="hacker-title">{profileFound.title}</p>}
            </div>

            <div className="socials">
              {profileFound.twitter_username && (
                <a href={`https://twitter.com/${profileFound.twitter_username}`} {...defaultAnchorProps}>
                  <TwitterIcon />
                </a>
              )}
              {profileFound.github_username && (
                <a href={`https://github.com/${profileFound.github_username}`} {...defaultAnchorProps}>
                  <GitHubIcon />
                </a>
              )}
            </div>
          </div>
        </>
      )}

      {isLoadingProfile && <Loading extraText={`${t("HackerProfile.loadingProfile")}...`} />}
    </StyledHackerProfilePage>
  );
};
