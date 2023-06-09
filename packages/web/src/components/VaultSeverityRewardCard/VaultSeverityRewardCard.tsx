import { IVault, IVulnerabilitySeverity } from "@hats-finance/shared";
import { NftPreview, Pill } from "components";
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
  const { rewardPercentage, rewardPrice, rewardColor } = useSeverityRewardInfo(vault, severityIndex);

  return (
    <StyledVaultSeverityRewardCard color={rewardColor} noNft={noNft}>
      <Pill isSeverity transparent textColor={rewardColor} text={severity?.name} />
      <div className="severity-prize">
        <div>
          <span>{`${rewardPercentage.toFixed(2)}%`}</span>
          <span className="tiny">&nbsp;{t("ofVault")}&nbsp;</span>
        </div>
        <span className="price">~{`$${formatNumber(rewardPrice)}`}</span>
      </div>
      {!noNft && (
        <div className="severity-nft">
          <NftPreview vault={vault} severityName={severity.name} nftData={severity["nft-metadata"]} size="tiny" />
        </div>
      )}
    </StyledVaultSeverityRewardCard>
  );
}
