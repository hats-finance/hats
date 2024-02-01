import { IVault, IVulnerabilitySeverity } from "@hats.finance/shared";
import { VaultNftRewardCard } from "components";
import { StyledVaultNftRewards } from "./styles";

type VaultNftRewardsProps = {
  vault: IVault;
};

export const VaultNftRewards = ({ vault }: VaultNftRewardsProps) => {
  if (!vault.description) return null;

  return (
    <StyledVaultNftRewards>
      {(vault.description.severities as IVulnerabilitySeverity[]).map((severity, index) => (
        <VaultNftRewardCard key={index} severity={severity} vault={vault} type="with_description" />
      ))}
    </StyledVaultNftRewards>
  );
};
