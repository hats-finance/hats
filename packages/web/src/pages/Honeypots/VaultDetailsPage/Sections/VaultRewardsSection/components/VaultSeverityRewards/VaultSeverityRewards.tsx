import { IVault } from "@hats-finance/shared";
import { generateColorsArrayInBetween } from "utils/colors.utils";

type VaultSeverityRewardsProps = {
  vault: IVault;
};

export const VaultSeverityRewards = ({ vault }: VaultSeverityRewardsProps) => {
  console.log(generateColorsArrayInBetween("24E8C5", "6652F7", 10));

  return <div>VaultSeverityRewards</div>;
};
