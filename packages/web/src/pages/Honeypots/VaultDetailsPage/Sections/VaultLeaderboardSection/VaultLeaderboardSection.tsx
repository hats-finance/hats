import { IPayoutGraph, IVault, IVulnerabilitySeverityV1, IVulnerabilitySeverityV2 } from "@hats-finance/shared";
import { Alert, Button, HackerProfileImage, Loading, Pill, WithTooltip } from "components";
import { ReleasePaymentSplitContract } from "contracts";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import millify from "millify";
import { RoutePaths } from "navigation";
import { useCachedProfile } from "pages/HackerProfile/useCachedProfile";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import { NavLink } from "react-router-dom";
import { shortenIfAddress } from "utils/addresses.utils";
import { parseSeverityName } from "utils/severityName";
import { useAccount } from "wagmi";
import { IAuditPayoutLeaderboardData, useAuditPayoutLeaderboardData } from "./hooks";
import { StyledLeaderboardSection } from "./styles";

type VaultLeaderboardSectionProps = {
  vault: IVault;
  noDeployed?: boolean;
  auditPayout?: IPayoutGraph | undefined;
};

export const VaultLeaderboardSection = ({ vault, auditPayout }: VaultLeaderboardSectionProps) => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const severityColors = getSeveritiesColorsArray(vault);
  const leaderboardData = useAuditPayoutLeaderboardData(vault, auditPayout);
  const isWinnerAddress = leaderboardData?.find(
    (leaderboardEntry) => leaderboardEntry.beneficiary?.toLowerCase() === address?.toLowerCase()
  );

  const releasePayment = ReleasePaymentSplitContract.hook(vault, auditPayout?.beneficiary);

  if (!auditPayout) return null;

  const severities = vault.description?.severities.map((severity) => parseSeverityName(severity.name)) ?? [];

  const executeRelease = () => {
    releasePayment.send();
  };

  return (
    <StyledLeaderboardSection cols={severities.length + 3}>
      <div className="leaderboard">
        <div className="header">#</div>
        <div className="header">S.R</div>
        <div className="header">Rewards</div>
        {vault.description?.severities.map((severity: IVulnerabilitySeverityV1 | IVulnerabilitySeverityV2, idx: number) => (
          <div className="header">
            <Pill textColor={severityColors[idx ?? 0]} isSeverity text={parseSeverityName(severity.name)} />
          </div>
        ))}

        {leaderboardData?.map((leaderboardEntry, idx) => (
          <>
            <div className="content">{idx + 1}.</div>
            <LeaderboardBeneficiaryName leaderboardEntry={leaderboardEntry} />
            <div className="content prize">${millify(leaderboardEntry.totalRewardInUSD)}</div>
            {vault.description?.severities.map((severity: IVulnerabilitySeverityV1 | IVulnerabilitySeverityV2) => (
              <div className="content">
                {leaderboardEntry.findings.find((finding) => finding.severity === parseSeverityName(severity.name))?.count ??
                  "--"}
              </div>
            ))}
          </>
        ))}
      </div>

      <br />
      <div className="mt-5">
        <p className="mb-4">{t("Leaderboard.ifYouAreAWinner")}</p>
        {!isWinnerAddress && <span className="error mb-1">{t("Leaderboard.needToBeConnectedWithAWinnerAddress")}</span>}
        <Button disabled={!isWinnerAddress} onClick={isWinnerAddress ? executeRelease : undefined}>
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
    </StyledLeaderboardSection>
  );
};

const LeaderboardBeneficiaryName = ({ leaderboardEntry }: { leaderboardEntry: IAuditPayoutLeaderboardData }) => {
  const hackerProfile = useCachedProfile(leaderboardEntry.beneficiary);
  return (
    <WithTooltip text={leaderboardEntry.beneficiary}>
      <div className="content sr-data">
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
  );
};
