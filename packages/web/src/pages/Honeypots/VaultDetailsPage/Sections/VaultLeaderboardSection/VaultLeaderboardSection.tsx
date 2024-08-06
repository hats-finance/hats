import { IPayoutGraph, IVault, parseSeverityName } from "@hats.finance/shared";
import { Alert, Button, HackerProfileImage, Loading, Pill, WithTooltip } from "components";
import { ReleasablePaymentSplitter, ReleasePaymentSplitContract, ReleasedPaymentSplitter } from "contracts";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import { useIsGovMember } from "hooks/useIsGovMember";
import { useIsGrowthMember } from "hooks/useIsGrowthMember";
import { useIsReviewer } from "hooks/useIsReviewer";
import millify from "millify";
import { RoutePaths } from "navigation";
import { useCachedProfile } from "pages/HackerProfile/useCachedProfile";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import { NavLink } from "react-router-dom";
import { appChains } from "settings";
import { shortenIfAddress } from "utils/addresses.utils";
import { Amount } from "utils/amounts.utils";
import { useAccount, useNetwork } from "wagmi";
import { IAuditPayoutLeaderboardData, useAuditPayoutLeaderboardData } from "./hooks";
import { StyledLeaderboardSection } from "./styles";

type VaultLeaderboardSectionProps = {
  vault: IVault;
  noDeployed?: boolean;
  auditPayout?: IPayoutGraph | undefined;
  hideClaimRewardsAction?: boolean;
};

export const VaultLeaderboardSection = ({ vault, auditPayout, hideClaimRewardsAction = false }: VaultLeaderboardSectionProps) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const isGovMember = useIsGovMember();
  const isReviewer = useIsReviewer();
  const isGrowthMember = useIsGrowthMember();
  const leaderboardData = useAuditPayoutLeaderboardData(vault, auditPayout);

  const chainId = Number(chain?.id);
  const govMultisig = appChains[Number(chainId)]?.govMultisig;

  const isGov = isGovMember || isReviewer || isGrowthMember;
  const isDepositor =
    auditPayout?.payoutData?.depositors?.find((depositor) => depositor.address.toLowerCase() === address?.toLowerCase()) &&
    vault.version === "v3" &&
    vault.description?.["project-metadata"].type === "audit";
  const isWinnerAddress = leaderboardData?.find(
    (leaderboardEntry) => leaderboardEntry.beneficiary?.toLowerCase() === address?.toLowerCase()
  );

  // IF gov member, use the gov multisig as the account to release the funds
  const releasable = ReleasablePaymentSplitter.hook(vault, auditPayout?.beneficiary, isGov ? govMultisig : address);
  const releasableAmount = new Amount(releasable, vault.stakingTokenDecimals, vault.stakingTokenSymbol);
  const released = ReleasedPaymentSplitter.hook(vault, auditPayout?.beneficiary, isGov ? govMultisig : address);
  const releasedAmount = new Amount(released, vault.stakingTokenDecimals, vault.stakingTokenSymbol);

  const severitiesInVault = vault.description?.severities.map((severity) => parseSeverityName(severity.name)) ?? [];
  const severitiesInPayout = [
    ...new Set(
      leaderboardData?.flatMap((leaderboardEntry) => leaderboardEntry.findings.map((finding) => finding.severity)) ?? []
    ),
  ];
  const severitiesToShow = [
    ...new Set([...severitiesInPayout.filter((s) => !severitiesInVault.includes(s)), ...severitiesInVault]),
  ];

  const severityColors = getSeveritiesColorsArray(undefined, severitiesToShow.length);

  const releasePayment = ReleasePaymentSplitContract.hook(vault, auditPayout?.beneficiary);

  if (!auditPayout) return null;

  const executeRelease = () => {
    if (!address || !chain) return;

    releasePayment.send(isGov ? govMultisig : address);
  };

  const getRole = () => {
    if (isGov) return "governance!";
    if (isDepositor) return "depositor!";
    if (isWinnerAddress) return "winner. Congrats!";
    return "";
  };

  return (
    <StyledLeaderboardSection cols={severitiesToShow.length + 3}>
      <div className="leaderboard-table">
        <div className="header align-left">#</div>
        <div className="header align-left">{t("whiteHat")}</div>
        <div className="header">{t("rewards")}</div>
        {severitiesToShow.map((name: string, idx: number) => (
          <div className="header" key={idx}>
            <Pill textColor={severityColors[idx ?? 0]} isSeverity text={parseSeverityName(name)} />
          </div>
        ))}

        {leaderboardData?.map((leaderboardEntry, idx) => (
          <LeaderboardEntry
            key={leaderboardEntry.beneficiary}
            leaderboardEntry={leaderboardEntry}
            vault={vault}
            idx={idx}
            severitiesToShow={severitiesToShow}
          />
        ))}
      </div>

      {!hideClaimRewardsAction && (
        <>
          <br />
          <div className="mt-5">
            <p className="mb-4">{t("Leaderboard.ifYouAreAWinner")}</p>
            {!isWinnerAddress && !isDepositor && !isGov && (
              <span className="error mb-1">{t("Leaderboard.needToBeConnectedWithAWinnerAddress")}</span>
            )}

            {(isWinnerAddress || isDepositor || isGov) && (
              <>
                <p className="mb-1">Hey, {getRole()}</p>
                <p className="mb-4">You can release: {releasableAmount.formatted()}</p>
                {releasedAmount.number > 0 && <p className="mb-4">You have released release: {releasedAmount.formatted()}</p>}
              </>
            )}

            <Button disabled={releasableAmount.number <= 0} onClick={executeRelease}>
              {t("Leaderboard.claimBounty")}
            </Button>

            {releasePayment.error && (
              <Alert className="mt-4" type="error">
                {t("Leaderboard.errorClaimingBounty")}
              </Alert>
            )}
            {releasePayment.isSuccess && (
              <Alert className="mt-4" type="success">
                {t("Leaderboard.claimedBountySuccessfully")}
              </Alert>
            )}
          </div>

          {releasePayment.isLoading && <Loading fixed extraText={`${t("loading")}...`} />}
        </>
      )}
    </StyledLeaderboardSection>
  );
};

type ILeaderboardEntryProps = {
  leaderboardEntry: IAuditPayoutLeaderboardData;
  idx: number;
  vault: IVault;
  severitiesToShow: string[];
};

const LeaderboardEntry = ({ leaderboardEntry, idx, severitiesToShow, vault }: ILeaderboardEntryProps) => {
  const hackerProfile = useCachedProfile(leaderboardEntry.beneficiary);
  return (
    <>
      <div className="content align-left">{idx + 1}.</div>
      <WithTooltip text={leaderboardEntry.beneficiary}>
        <div className="content align-left">
          {hackerProfile ? (
            <NavLink to={`${RoutePaths.profile}/${hackerProfile.username}`} className="address profile">
              <HackerProfileImage noMargin hackerProfile={hackerProfile} size="xsmall" />
              <p>{hackerProfile.username}</p>
            </NavLink>
          ) : (
            <div className="address">
              <Identicon string={leaderboardEntry.beneficiary} size={24} bg="#fff" />
              {shortenIfAddress(leaderboardEntry.beneficiary, { startLength: 6 })}
            </div>
          )}
        </div>
      </WithTooltip>
      <div className="content prize">
        <WithTooltip text={`${millify(leaderboardEntry.totalRewards.tokens)} ${leaderboardEntry.rewardToken}`}>
          <p>
            {leaderboardEntry.totalRewards.usd !== 0
              ? `$${millify(leaderboardEntry.totalRewards.usd)}`
              : `${vault.stakingTokenSymbol} ${millify(leaderboardEntry.totalRewards.tokens)}`}
          </p>
        </WithTooltip>
      </div>
      {severitiesToShow.map((severity: string) => {
        const finding = leaderboardEntry.findings.find((finding) => finding.severity === parseSeverityName(severity));
        const prizeInUsd = `$${millify(finding?.totalRewards.usd ?? 0)}`;
        const prizeInTokens = `${millify(finding?.totalRewards.tokens ?? 0)} ${leaderboardEntry.rewardToken}`;

        return (
          <div className="content" key={severity}>
            <WithTooltip text={`${prizeInUsd} (${prizeInTokens})`}>
              <p>{finding?.count ?? "--"}</p>
            </WithTooltip>
          </div>
        );
      })}
    </>
  );
};
