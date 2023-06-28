import { IVault } from "@hats-finance/shared";
import { VaultSeverityRewardCard } from "components";
import { StyledVaultSeverityRewards } from "./styles";

type VaultSeverityRewardsProps = {
  vault: IVault;
};

export const VaultSeverityRewards = ({ vault }: VaultSeverityRewardsProps) => {
  if (!vault.description) return null;

  return (
    <StyledVaultSeverityRewards>
      {vault.description.severities.map((severity, idx) => (
        <VaultSeverityRewardCard key={idx} noNft vault={vault} severity={severity} severityIndex={idx} />
      ))}
    </StyledVaultSeverityRewards>
  );
};
