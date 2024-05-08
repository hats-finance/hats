import LinkIcon from "@mui/icons-material/AddLinkOutlined";
import ArrowIcon from "@mui/icons-material/ArrowBackOutlined";
import UnlinkIcon from "@mui/icons-material/LinkOffOutlined";
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import GitHubIcon from "assets/icons/social/github.icon";
import TwitterIcon from "assets/icons/social/twitter.icon";
import XIcon from "assets/icons/social/x.icon";
import { Alert, Button, DropdownSelector, HackerProfileImage, HackerStreak, Loading, Modal, Pill, Seo } from "components";
import { queryClient } from "config/reactQuery";
import { LocalStorage } from "constants/constants";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import { ISiweData, useSiweAuth } from "hooks/siwe/useSiweAuth";
import useConfirm from "hooks/useConfirm";
import useModal from "hooks/useModal";
import moment from "moment";
import { RoutePaths } from "navigation";
import { useAllTimeLeaderboard } from "pages/Leaderboard/LeaderboardPage/components/AllTimeLeaderboard/useAllTimeLeaderboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BASE_SERVICE_URL } from "settings";
import { formatNumber } from "utils";
import { shortenIfAddress } from "utils/addresses.utils";
import { useAccount } from "wagmi";
import { CreateProfileFormModal } from "../components";
import {
  useLinkNewAddress,
  useLinkOAuth,
  useProfileByAddress,
  useProfileByUsername,
  useUnlinkAddress,
  useUnlinkOAuth,
} from "../hooks";
import { useAddressesStats } from "../useAddressesStats";
import { useAddressesStreak } from "../useAddressesStreak";
import { HackerActivity } from "./components/HackerActivity";
import { StyledHackerProfilePage } from "./styles";

export const HackerProfilePage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { address } = useAccount();
  const { username } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { tryAuthentication, signIn, profileData: siweProfile, isAuthenticated, isSigningIn } = useSiweAuth();

  const [showSettings, setShowSettings] = useState(false);
  const [oAuthLinking, setOAuthLinking] = useState<"twitter">();
  const { isShowing: isShowingUpdateProfile, show: showUpdateProfile, hide: hideUpdateProfile } = useModal();
  const [ownerSiweData, setOwnerSiweData] = useState<ISiweData>();

  const { data: createdProfile } = useProfileByAddress(address);
  const { data: profileFound, isLoading: isLoadingProfile } = useProfileByUsername(username);
  const profileStats = useAddressesStats(profileFound?.addresses ?? []);
  const severityColors = getSeveritiesColorsArray(undefined, profileStats.findingsGlobalStats.length);
  const isProfileOwner = address && profileFound?.addresses.includes(address.toLowerCase());
  const streakStats = useAddressesStreak(profileFound?.addresses ?? []);
  const { leaderboard } = useAllTimeLeaderboard();
  const positionInLeaderboard = leaderboard?.findIndex((leaderboardEntry) =>
    profileFound?.addresses.includes(leaderboardEntry.address.toLowerCase())
  );

  const linkOAuth = useLinkOAuth();
  const unlinkOAuth = useUnlinkOAuth();
  const linkNewAddress = useLinkNewAddress();
  const unlinkAddress = useUnlinkAddress();

  // If the user is not authenticated, and is is process of linking a new address, continue with the linking process
  useEffect(() => {
    if (!ownerSiweData || !profileFound) return;
    if (profileFound.addresses.includes(siweProfile.address?.toLowerCase() ?? "")) return;
    if (isAuthenticated) return;
    setOwnerSiweData(undefined);

    const check = async () => {
      const auth = await tryAuthentication();
      if (!auth) return;

      try {
        const linkResult = await linkNewAddress.mutateAsync({ username: profileFound.username, profileOwnerSiwe: ownerSiweData });
        if (linkResult?.modifiedCount) {
          queryClient.invalidateQueries({ queryKey: ["hacker-profile-username", profileFound.username] });
          queryClient.invalidateQueries({ queryKey: ["all-profiles"] });
        }
      } finally {
        setOwnerSiweData(undefined);
      }
    };
    check();
  }, [isAuthenticated, siweProfile, tryAuthentication, ownerSiweData, linkNewAddress, profileFound]);

  // Verify if we need to link oauth
  useEffect(() => {
    const oauth = searchParams.get("oauth") as typeof oAuthLinking;
    if (!oauth || !createdProfile) return;
    if (linkOAuth.isLoading || linkOAuth.isSuccess) return;
    if (isSigningIn || oAuthLinking) return;

    // If the user is not the owner of the profile, redirect to the home page
    if (createdProfile.username.toLowerCase() !== username?.toLowerCase()) {
      return navigate(`/`);
    }

    // Check if account has already a connected oauth account
    if (createdProfile.oauth?.[oauth]) {
      return navigate(`${RoutePaths.profile}/${createdProfile.username}`);
    }

    const oauthData = JSON.parse(localStorage.getItem(`${LocalStorage.oauthData}_${oauth}`) ?? "null");
    if (!oauthData) return;

    setOAuthLinking(oauth ?? undefined);
  }, [searchParams, createdProfile, navigate, username, linkOAuth, isSigningIn, oAuthLinking]);

  if (profileStats.isLoading) return <Loading extraText={`${t("HackerProfile.loadingStats")}...`} />;

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

  const handleUnlinkAddress = async (addressToRemove: string) => {
    if (!profileFound) return;
    if (profileFound.addresses.length === 1) return;

    const wantsToUnlink = await confirm({
      title: t("HackerProfile.unlinkAddress"),
      titleIcon: <UnlinkIcon className="mr-2" fontSize="large" />,
      description: t("HackerProfile.unlinkAddressExplanation"),
      confirmText: t("HackerProfile.unlinkAddress"),
    });

    if (!wantsToUnlink) return;

    const signedIn = await tryAuthentication();
    if (!signedIn) return;

    const unlinkResult = await unlinkAddress.mutateAsync({ username: profileFound.username, addressToRemove });
    if (unlinkResult?.modifiedCount) {
      queryClient.invalidateQueries({ queryKey: ["hacker-profile-username", profileFound.username] });
      queryClient.invalidateQueries({ queryKey: ["all-profiles"] });
    }
  };

  const handleStartLinkNewAddress = async () => {
    if (!profileFound) return;

    const wantsToAdd = await confirm({
      title: t("HackerProfile.linkNewAddressToProfile"),
      titleIcon: <LinkIcon className="mr-2" fontSize="large" />,
      description: t("HackerProfile.linkNewAddressToProfileExplanation"),
      confirmText: t("HackerProfile.verifyOwnership"),
    });
    if (!wantsToAdd) return setOwnerSiweData(undefined);

    const { ok, siweData: _siweData } = await signIn();
    if (!ok) return;
    const siweData = _siweData!;

    setTimeout(() => setOwnerSiweData(siweData), 500);
    const wantsToContinue = await confirm({
      title: t("HackerProfile.linkNewAddressToProfile"),
      titleIcon: <LinkIcon className="mr-2" fontSize="large" />,
      description: t("HackerProfile.linkNewAddressToProfilePartTwoExplanation"),
      confirmText: t("gotIt"),
    });
    if (!wantsToContinue) return setOwnerSiweData(undefined);
  };

  const getSettingsOptions = () => {
    return [
      { label: t("HackerProfile.updateProfileCta"), onClick: showUpdateProfile, icon: <EditIcon /> },
      { label: t("HackerProfile.linkNewAddress"), onClick: handleStartLinkNewAddress, icon: <LinkIcon /> },
    ];
  };

  const handleLinkOAuth = async () => {
    if (!oAuthLinking || !profileFound) return;

    const auth = await tryAuthentication();
    if (!auth) return;

    const oauthParams = JSON.parse(localStorage.getItem(`${LocalStorage.oauthData}_${oAuthLinking}`) ?? "null");
    if (!oauthParams) return;

    try {
      await linkOAuth.mutateAsync({
        username: profileFound.username,
        oauth: oAuthLinking,
        oauthParams,
      });

      queryClient.invalidateQueries({ queryKey: ["hacker-profile-username", profileFound.username] });
      queryClient.invalidateQueries({ queryKey: ["all-profiles"] });
      setOAuthLinking(undefined);

      return navigate(`${RoutePaths.profile}/${profileFound.username}`);
    } catch (error) {
      console.error("ERROR linking oauth", error);
      return navigate(`${RoutePaths.profile}/${profileFound.username}`);
    }
  };

  const handleStartOAuthLink = (oauth: typeof oAuthLinking) => {
    const url = `${BASE_SERVICE_URL}/oauth/${oauth}/login`;
    // Open the oauth login page in the current window
    window.open(url, "_self");
  };

  const handleUnlinkOAuth = async (oauth: typeof oAuthLinking) => {
    if (!createdProfile || !oauth) return;

    const wantsToUnlink = await confirm({
      title: t("HackerProfile.unlinkOAuth", { oauth }),
      titleIcon: <UnlinkIcon className="mr-2" fontSize="large" />,
      description: t("HackerProfile.unlinkOAuthExplanation"),
      confirmText: t("HackerProfile.unlinkOAuth", { oauth }),
    });
    if (!wantsToUnlink) return;

    const auth = await tryAuthentication();
    if (!auth) return;

    await unlinkOAuth.mutateAsync({
      username: createdProfile.username,
      oauth,
    });

    queryClient.invalidateQueries({ queryKey: ["hacker-profile-username", createdProfile.username] });
    queryClient.invalidateQueries({ queryKey: ["all-profiles"] });
  };

  return (
    <>
      <Seo title={t("seo.hackerProfileTitle", { username: profileFound?.username })} />
      <StyledHackerProfilePage className="content-wrapper" unlinkDisabled={profileFound?.addresses.length === 1}>
        {profileFound && (
          <>
            <div className="header">
              <div className="settings">
                <div className="icon" onClick={() => setShowSettings((prev) => !prev)}>
                  <SettingsIcon fontSize="large" />
                </div>

                <DropdownSelector options={getSettingsOptions()} show={showSettings} onClose={() => setShowSettings(false)} />
              </div>

              <div className="profile-card">
                <HackerProfileImage noMargin hackerProfile={profileFound} size="large" />
                <div className="description">
                  <h2>{profileFound.username}</h2>
                  {profileFound.title && <p className="hacker-title">{profileFound.title}</p>}
                  {profileStats.firstSubmissionDate && (
                    <p className="hacker-date mt-2">
                      {t("HackerProfile.firstSubmission", {
                        date: moment(profileStats.firstSubmissionDate).format("D MMM YYYY"),
                      })}
                    </p>
                  )}

                  <div className="socials">
                    {profileFound.twitter_username && (
                      <a href={`https://twitter.com/${profileFound.twitter_username}`} {...defaultAnchorProps}>
                        <XIcon />
                      </a>
                    )}
                    {profileFound.github_username && (
                      <a href={`https://github.com/${profileFound.github_username}`} {...defaultAnchorProps}>
                        <GitHubIcon />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {streakStats.streakCount !== 0 && (
                <div className="mb-5">
                  <HackerStreak streak={streakStats.streakCount} maxStreak={streakStats.maxStreak} />
                </div>
              )}

              {/* OAUTH connected */}
              {isProfileOwner && (
                <div className="oauth-connectors">
                  <div
                    className={`connector ${profileFound.oauth?.twitter ? "linked" : ""}`}
                    onClick={
                      profileFound.oauth?.twitter ? () => handleUnlinkOAuth("twitter") : () => handleStartOAuthLink("twitter")
                    }
                  >
                    <XIcon />
                    {profileFound.oauth?.twitter ? (
                      <p>@{profileFound.oauth?.twitter?.username}</p>
                    ) : (
                      <p>{t("HackerProfile.connectOauthAccount", { oauth: "X" })}</p>
                    )}
                  </div>
                  <div className={`connector ${profileFound.oauth?.twitter ? "linked" : ""}`}>
                    <GitHubIcon />
                    {profileFound.oauth?.twitter ? (
                      <p>@{profileFound.oauth?.twitter?.username}</p>
                    ) : (
                      <p>{t("HackerProfile.connectOauthAccount", { oauth: "Github" })}</p>
                    )}
                  </div>
                </div>
              )}

              {(unlinkAddress.error || linkNewAddress.error) && (
                <Alert className="mb-3" type="error" content={unlinkAddress.error ?? linkNewAddress.error ?? ""} />
              )}

              {isProfileOwner && (
                <div className="actions">
                  <div className="linked-addresses">
                    <h3>{t("HackerProfile.linkedAddresses")}:</h3>
                    <div className="addresses-list">
                      {profileFound.addresses.map((address, idx) => (
                        <div className="address" key={address} onClick={() => handleUnlinkAddress(address)}>
                          <Pill text={shortenIfAddress(address, { startLength: 6 })} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="stats-container">
              {profileFound.bio && (
                <div className="about">
                  <h3>{t("HackerProfile.about")}</h3>
                  <p>{profileFound.bio}</p>
                </div>
              )}
              <div className="findings">
                <div className="total-rewards">
                  <h3>{t("HackerProfile.stats")}</h3>
                  <div className="main-stats">
                    {positionInLeaderboard !== -1 && (
                      <div className="totalPrizes">
                        <p>{`#${positionInLeaderboard + 1}`}</p>
                        <span>{t("HackerProfile.allTime")}</span>
                      </div>
                    )}
                    {profileStats.totalRewardsInUsd > 0 && (
                      <div className="totalPrizes">
                        <p>{`~$${formatNumber(profileStats.totalRewardsInUsd, 2)}`}</p>
                        <span>{t("HackerProfile.earnedAtHatsFinance")}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="findings-list">
                  {profileStats.findingsGlobalStats.length === 0 && (
                    <Alert type="info" content={t("HackerProfile.youHaveNoStats")} />
                  )}
                  {profileStats.findingsGlobalStats.map((severity, idx) => (
                    <div className="stat" key={severity.severity}>
                      <p className="count">{severity.count}</p>
                      <Pill textColor={severityColors[idx]} isSeverity text={severity.severity} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {profileStats.hackerRewardStats.length > 0 && <HackerActivity activity={profileStats.hackerRewardStats} />}
          </>
        )}

        {isLoadingProfile && <Loading extraText={`${t("HackerProfile.loadingProfile")}...`} />}
      </StyledHackerProfilePage>

      <CreateProfileFormModal isShowing={isShowingUpdateProfile} onHide={hideUpdateProfile} />
      <Modal
        capitalizeTitle
        isShowing={!!oAuthLinking && !isLoadingProfile}
        disableClose
        title={t("HackerProfile.linkYourAccount", { oauth: oAuthLinking })}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, minWidth: 350 }}>
          <Button
            expanded
            onClick={() => {
              localStorage.removeItem(`${LocalStorage.oauthData}_${oAuthLinking}`);
              navigate(`${RoutePaths.profile}/${profileFound?.username}`);
              setOAuthLinking(undefined);
            }}
            styleType="outlined"
          >
            {t("cancel")}
          </Button>
          <Button expanded onClick={handleLinkOAuth}>
            {t("HackerProfile.connectOauthAccount", { oauth: oAuthLinking })}
          </Button>
        </div>
      </Modal>
    </>
  );
};
