import { IVault, IVulnerabilitySeverity, IVulnerabilitySeverityV2 } from "@hats-finance/shared";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Pill, VaultNftRewardCard, WithTooltip } from "components";
import { useSeverityRewardInfo } from "hooks/severities/useSeverityRewardInfo";
import { useTranslation } from "react-i18next";
import { formatNumber } from "utils";
import { StyledVaultSeverityRewardCard } from "./styles";

interface VaultSeverityRewardCardProps {
  vault: IVault;
  severity: IVulnerabilitySeverity;
  severityIndex: number;
  noNft?: boolean;
}

export function VaultSeverityRewardCard({ vault, severity, severityIndex, noNft = false }: VaultSeverityRewardCardProps) {
  const { t } = useTranslation();
  const { rewardPercentage, rewardPrice, rewardCap, rewardColor } = useSeverityRewardInfo(vault, severityIndex);

  const severityName = severity?.name.toLowerCase().replace("severity", "") ?? "";
  const showCap = vault.version === "v2" && vault.description?.severities.some((sev) => !!sev.capAmount);

  return (
    <StyledVaultSeverityRewardCard columns={2 + (noNft ? 0 : 1) + (showCap ? 1 : 0)} color={rewardColor}>
      <div className="severity-name">
        <Pill isSeverity transparent textColor={rewardColor} text={severityName} />
      </div>
      <div className="severity-prize">
        <div>
          <span>{`${rewardPercentage.toFixed(2)}%`}</span>
          <span className="tiny">&nbsp;{t("ofRewards")}&nbsp;</span>
        </div>
        <span className="price">~{`$${formatNumber(rewardPrice)}`}</span>
      </div>
      {showCap && (
        <>
          {(severity as IVulnerabilitySeverityV2).capAmount ? (
            <WithTooltip text={t("maxRewardCapExplanation")}>
              <div className="severity-prize">
                <div className="title-container">
                  <span className="tiny">{t("maxRewardCap")}</span>
                  <InfoIcon fontSize="small" />
                </div>
                <span className="price">~{`$${formatNumber(rewardCap)}`}</span>
              </div>
            </WithTooltip>
          ) : (
            <div />
          )}
        </>
      )}
      {!noNft && (
        <div className="severity-nft">
          <VaultNftRewardCard vault={vault} severity={severity} type="tiny" />
        </div>
      )}
    </StyledVaultSeverityRewardCard>
  );
}
