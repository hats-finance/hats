import { useContext } from "react";
import { VaultDetailsContext } from "../../store";
import { StyledRewardsSection } from "./styles";

export const VaultRewardsSection = () => {
  const { vault } = useContext(VaultDetailsContext);

  return <StyledRewardsSection>VaultRewardsSection</StyledRewardsSection>;
};
