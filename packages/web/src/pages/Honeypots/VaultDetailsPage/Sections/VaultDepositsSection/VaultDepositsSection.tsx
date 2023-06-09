import { useContext } from "react";
import { VaultDetailsContext } from "../../store";
import { StyledDepositsSection } from "./styles";

export const VaultDepositsSection = () => {
  const { vault } = useContext(VaultDetailsContext);

  return <StyledDepositsSection>VaultDepositsSection</StyledDepositsSection>;
};
