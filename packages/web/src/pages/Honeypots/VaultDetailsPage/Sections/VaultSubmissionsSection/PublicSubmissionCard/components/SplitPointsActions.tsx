import { GithubIssue, GithubPR, IClaimedIssue } from "@hats.finance/shared";
import { IVault } from "@hats.finance/shared";
import UploadIcon from "@mui/icons-material/FileUploadOutlined";
import FlagIcon from "@mui/icons-material/OutlinedFlagOutlined";
import { Button, HackerProfileImage, Loading, Pill, WithTooltip } from "components";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import useConfirm from "hooks/useConfirm";
import moment from "moment";
import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useAllTimeLeaderboard } from "pages/Leaderboard/LeaderboardPage/components/AllTimeLeaderboard/useAllTimeLeaderboard";
import { useTranslation } from "react-i18next";
import { IS_PROD, appChains } from "settings";
import { useAccount, useNetwork } from "wagmi";
import { useClaimIssue, useClaimedIssuesByVault } from "../hooks";
import { StyledSplitPointsActions } from "./styles";

export const getClaimedBy = (claimedIssue: IClaimedIssue | undefined) => {
  if (!claimedIssue) return undefined;

  const isExpired = moment(claimedIssue.expiresAt).isBefore(moment());
  if (isExpired) return undefined;

  return claimedIssue;
};

type SplitPointsActionsProps = {
  vault: IVault;
  submission: GithubIssue;
  linkedPRs: GithubPR[];
};

export const SplitPointsActions = ({ vault, submission, linkedPRs }: SplitPointsActionsProps) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { tryAuthentication } = useSiweAuth();
  const confirm = useConfirm();

  const { leaderboard } = useAllTimeLeaderboard("all", "streak");
  const { data: profile } = useProfileByAddress(address);

  const connectedChain = chain ? appChains[chain.id] : null;
  const isTestnet = !IS_PROD && connectedChain?.chain.testnet;
  const TOP_LEADERBOARD_PERCENTAGE = 0.2;
  const TOP_LEADERBOARD_MIN_REWARDS = 5000;

  const isConnected = !!address;
  const isProfileCreated = !!profile;

  const {
    data: claimedIssues,
    isLoading: isLoadingClaimedIssues,
    refetch: refetchClaimedIssues,
  } = useClaimedIssuesByVault(vault);
  const claimIssue = useClaimIssue();

  const leaderboardInBoundaries = leaderboard
    .slice(0, Math.floor(leaderboard.length * TOP_LEADERBOARD_PERCENTAGE))
    .filter((entry) => entry.totalAmount.usd >= TOP_LEADERBOARD_MIN_REWARDS);
  const isInLeadearboardBoundaries = isTestnet
    ? true
    : leaderboardInBoundaries.find((entry) => entry.address.toLowerCase() === address?.toLowerCase());

  const claimInfo = claimedIssues?.find((issue) => +issue.issueNumber === +submission.number);
  const claimedByInfo = getClaimedBy(claimInfo);
  const { data: claimedByProfile } = useProfileByAddress(claimedByInfo?.claimedBy);

  const isClaimedByCurrentUser = claimedByInfo?.claimedBy.toLowerCase() === address?.toLowerCase();
  const isOpenToSubmissions = linkedPRs.length === 0 ? true : linkedPRs?.every((pr) => pr.bonusSubmissionStatus === "INCOMPLETE");

  const canExecuteAction = () => {
    if (isClaimedByCurrentUser) return { can: true };
    if (claimedByInfo) return { can: false, reason: t("issueAlreadyClaimed") };

    if (!isConnected) return { can: false, reason: t("youNeedToConnectYourWallet") };
    if (!isInLeadearboardBoundaries || !isProfileCreated) return { can: false, reason: t("youAreNotInTopLeaderboardPercentage") };
    if (!isOpenToSubmissions) {
      const isCompleted = linkedPRs.some((pr) => pr.bonusSubmissionStatus === "COMPLETE");
      return { can: false, reason: isCompleted ? t("issueAlreadyHaveValidSubmission") : t("oneSubmissionIsBeingReviewed") };
    }
    return { can: true };
  };

  const getActionButtonContent = () => {
    if (isClaimedByCurrentUser)
      return (
        <>
          <UploadIcon className="mr-1" />
          <span>Submit Fix & Test</span>
        </>
      );
    if (submission.bonusPointsLabels.needsFix && submission.bonusPointsLabels.needsTest)
      return (
        <>
          <FlagIcon className="mr-1" />
          <span>Claim Fix & Test</span>
        </>
      );
    if (submission.bonusPointsLabels.needsFix)
      return (
        <>
          <FlagIcon className="mr-1" />
          <span>Claim Fix</span>
        </>
      );

    if (submission.bonusPointsLabels.needsTest)
      return (
        <>
          <FlagIcon className="mr-1" />
          <span>Claim Test</span>
        </>
      );
    return "";
  };

  const getClaimedByInfo = () => {
    return (
      <div className="claimed-by-container">
        <p>Issue claimed by:</p>
        <div className="claimed-by-info">
          <div className="profile-container">
            <HackerProfileImage hackerProfile={claimedByProfile} size="xxsmall" noMargin />
            <span>{claimedByProfile?.username}</span>
          </div>
          <Pill
            dotColor="green"
            textColor="white"
            transparent
            text={`Claim ends ${moment(claimedByInfo?.expiresAt).fromNow()}`}
          />
        </div>
      </div>
    );
  };

  const handleClaimIssue = async () => {
    if (!canExecuteAction().can) return;

    const wantsToClaim = await confirm({
      title: t("claimIssue"),
      titleIcon: <FlagIcon className="mr-2" fontSize="large" />,
      description: t("claimIssueDescription"),
      cancelText: t("no"),
      confirmText: t("yes"),
    });

    if (!wantsToClaim) return;

    const signedIn = await tryAuthentication();
    if (!signedIn) return;

    await claimIssue.mutateAsync({ vault, issueNumber: submission.number });
    refetchClaimedIssues();
  };

  if (isLoadingClaimedIssues) return null;

  return (
    <StyledSplitPointsActions>
      <WithTooltip text={canExecuteAction().reason}>
        <div>
          <Button
            size="medium"
            disabled={!canExecuteAction().can}
            onClick={handleClaimIssue}
            filledColor={isClaimedByCurrentUser ? "secondary" : "primary"}
          >
            {getActionButtonContent()}
          </Button>
        </div>
      </WithTooltip>

      {claimedByInfo && <div className="claimed-by">{getClaimedByInfo()}</div>}

      {claimIssue.isLoading && <Loading fixed extraText={`${t("loading")}...`} />}
    </StyledSplitPointsActions>
  );
};
