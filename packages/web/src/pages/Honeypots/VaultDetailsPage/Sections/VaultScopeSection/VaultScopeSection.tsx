import { useContext } from "react";
import { VaultDetailsContext } from "../../store";
import { StyledScopeSection } from "./styles";

export const VaultScopeSection = () => {
  const { vault } = useContext(VaultDetailsContext);

  return <StyledScopeSection>VaultScopeSection</StyledScopeSection>;
};
