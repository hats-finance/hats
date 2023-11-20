import LinkIcon from "@mui/icons-material/AddLinkOutlined";
import ArrowIcon from "@mui/icons-material/ArrowBackOutlined";
import UnlinkIcon from "@mui/icons-material/LinkOffOutlined";
import GitHubIcon from "assets/icons/social/github.icon";
import TwitterIcon from "assets/icons/social/twitter.icon";
import { Alert, Button, HackerProfileImage, HackerStreak, Loading, Pill, Seo } from "components";
import { queryClient } from "config/reactQuery";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import { ISiweData, useSiweAuth } from "hooks/siwe/useSiweAuth";
import useConfirm from "hooks/useConfirm";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { formatNumber } from "utils";
import { shortenIfAddress } from "utils/addresses.utils";
import { useAccount } from "wagmi";
import { useLinkNewAddress, useProfileByUsername, useUnlinkAddress } from "../hooks";
import { useAddressesStats } from "../useAddressesStats";
import { useAddressesStreak } from "../useAddressesStreak";
import { HackerActivity } from "./components/HackerActivity";
import { StyledHackerProfilePage } from "./styles";

export const HackerProfilePage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { username } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { tryAuthentication, signIn, profileData: siweProfile, isAuthenticated } = useSiweAuth();

  const [ownerSiweData, setOwnerSiweData] = useState<ISiweData>();

  const { data: profileFound, isLoading: isLoadingProfile } = useProfileByUsername(username);
  const profileStats = useAddressesStats(profileFound?.addresses ?? []);
  const severityColors = getSeveritiesColorsArray(undefined, profileStats.findingsGlobalStats.length);
  const isProfileOwner = address && profileFound?.addresses.includes(address.toLowerCase());
  const streakStats = useAddressesStreak(profileFound?.addresses ?? []);

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

  return (
    <>
      <Seo title={t("seo.hackerProfileTitle", { username: profileFound?.username })} />
      <StyledHackerProfilePage className="content-wrapper" unlinkDisabled={profileFound?.addresses.length === 1}>
        {profileFound && (
          <>
            <div className="header">
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
              </div>

              {streakStats.streakCount !== 0 && (
                <div className="mb-5">
                  <HackerStreak streak={streakStats.streakCount} maxStreak={streakStats.maxStreak} />
                </div>
              )}

              {(unlinkAddress.error || linkNewAddress.error) && (
                <Alert className="mb-3" type="error" content={unlinkAddress.error ?? linkNewAddress.error ?? ""} />
              )}

              {isProfileOwner && (
                <div className="actions">
                  <div className="buttons">
                    <Button onClick={handleStartLinkNewAddress}>
                      <LinkIcon className="mr-2" />
                      {t("HackerProfile.linkNewAddress")}
                    </Button>
                  </div>

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
                  {profileStats.totalRewardsInUsd > 0 && (
                    <div className="totalPrizes">
                      <p>{`~$${formatNumber(profileStats.totalRewardsInUsd, 2)}`}</p>
                      <span>{t("HackerProfile.earnedAtHatsFinance")}</span>
                    </div>
                  )}
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
    </>
  );
};
