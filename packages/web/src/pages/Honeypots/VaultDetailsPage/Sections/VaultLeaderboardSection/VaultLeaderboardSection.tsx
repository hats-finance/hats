import { IPayoutGraph, IVault, IVulnerabilitySeverityV1, IVulnerabilitySeverityV2 } from "@hats-finance/shared";
import { Button, Pill, WithTooltip } from "components";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import millify from "millify";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import { appChains } from "settings";
import { shortenIfAddress } from "utils/addresses.utils";
import { parseSeverityName } from "utils/severityName";
import { useAuditPayoutLeaderboardData } from "./hooks";
import { StyledLeaderboardSection } from "./styles";

type VaultLeaderboardSectionProps = {
  vault: IVault;
  noDeployed?: boolean;
  auditPayout?: IPayoutGraph | undefined;
};

export const VaultLeaderboardSection = ({ vault, auditPayout }: VaultLeaderboardSectionProps) => {
  const { t } = useTranslation();

  const severityColors = getSeveritiesColorsArray(vault);
  const leaderboardData = useAuditPayoutLeaderboardData(vault, auditPayout);

  if (!auditPayout) return null;

  const severities = vault.description?.severities.map((severity) => parseSeverityName(severity.name)) ?? [];

  const goToPayoutContract = () => {
    const blockExplorerUrl = appChains[vault.chainId].chain.blockExplorers?.default.url;
    window.open(`${blockExplorerUrl}/address/${auditPayout.beneficiary}#writeContract#F3`, "_blank");
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
            <WithTooltip text={leaderboardEntry.beneficiary}>
              <div className="content">
                <Identicon string={leaderboardEntry.beneficiary} size={24} bg="#fff" />{" "}
                {shortenIfAddress(leaderboardEntry.beneficiary, { startLength: 6 })}
              </div>
            </WithTooltip>
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
        <p>{t("Leaderboard.ifYouAreAWinner")}</p>
        <ol className="ml-5 mt-2">
          <li>
            <Button styleType="text" onClick={goToPayoutContract}>
              {t("Leaderboard.goToPayoutContract")}
            </Button>
          </li>
          <li>{t("Leaderboard.enterOnContractTab")}</li>
          <li>
            {t("Leaderboard.executeReleaseFunction")}
            <ul className="ml-2">
              <li>{t("Leaderboard.tokenAddress", { token: vault.stakingToken })}</li>
              <li>{t("Leaderboard.accountAddress")}</li>
            </ul>
          </li>
        </ol>
      </div>
    </StyledLeaderboardSection>
  );
};
