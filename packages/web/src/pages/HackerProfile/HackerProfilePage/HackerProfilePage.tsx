import ArrowIcon from "@mui/icons-material/ArrowBackOutlined";
import GitHubIcon from "assets/icons/social/github.icon";
import TwitterIcon from "assets/icons/social/twitter.icon";
import { Alert, Button, HackerProfileImage, Loading, Pill } from "components";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useProfileByUsername } from "../hooks";
import { HackerActivity } from "./components/HackerActivity";
import { StyledHackerProfilePage } from "./styles";
import { useAddressesStats } from "./useAddressesStats";

export const HackerProfilePage = () => {
  const { t } = useTranslation();
  const { username } = useParams();
  const navigate = useNavigate();

  const { data: profileFound, isLoading: isLoadingProfile } = useProfileByUsername(username);
  const profileStats = useAddressesStats(profileFound?.addresses ?? []);
  const severityColors = getSeveritiesColorsArray(undefined, profileStats.findingsGlobalStats.length);
  console.log(profileStats);

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
              {profileStats.firstSubmissionDate && (
                <p className="hacker-date mt-2">
                  {t("HackerProfile.firstSubmission", { date: moment(profileStats.firstSubmissionDate).format("D MMM YYYY") })}
                </p>
              )}
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

          <div className="stats-container">
            {profileFound.bio && (
              <div className="about">
                <h3>{t("HackerProfile.about")}</h3>
                <p>{profileFound.bio}</p>
              </div>
            )}
            <div className="findings">
              <h3>{t("HackerProfile.stats")}</h3>
              <div className="findings-list">
                {profileStats.findingsGlobalStats.map((severity, idx) => (
                  <div className="stat" key={severity.severity}>
                    <p className="count">{severity.count}</p>
                    <Pill textColor={severityColors[idx]} isSeverity text={severity.severity} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <HackerActivity activity={profileStats.hackerRewardStats} />
        </>
      )}

      {isLoadingProfile && <Loading extraText={`${t("HackerProfile.loadingProfile")}...`} />}
    </StyledHackerProfilePage>
  );
};
