import { IVault, IVulnerabilitySeverity } from "@hats-finance/shared";
import { NftPreview } from "components";
import { useSeverityReward } from "components/Vault/hooks/useSeverityReward";
import { useTranslation } from "react-i18next";
import { formatNumber } from "utils";
import { StyledVaultRewardCard } from "./styles";

interface VaultRewardCardProps {
  vault: IVault;
  severity: IVulnerabilitySeverity;
  severityIndex: number;
}

export function VaultRewardCard({ vault, severity, severityIndex }: VaultRewardCardProps) {
  const { t } = useTranslation();
  const { rewardPercentage, rewardPrice, rewardColor } = useSeverityReward(vault, severityIndex);

  return (
    <StyledVaultRewardCard color={rewardColor}>
      <div className="severity-name">{severity?.name}</div>
      <div className="severity-prize">
        <span>{`${rewardPercentage.toFixed(2)}%`}</span>
        <span className="tiny">&nbsp;{t("ofVault")}&nbsp;</span>
        <span className="price">≈ {`$${formatNumber(rewardPrice)}`}</span>
      </div>
      <div className="severity-nft">
        <NftPreview vault={vault} severityName={severity.name} nftData={severity["nft-metadata"]} size="tiny" />
      </div>
    </StyledVaultRewardCard>
  );
}
