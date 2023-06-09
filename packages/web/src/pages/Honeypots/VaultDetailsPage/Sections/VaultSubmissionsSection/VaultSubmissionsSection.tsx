import { useContext } from "react";
import { VaultDetailsContext } from "../../store";
import { StyledSubmissionsSection } from "./styles";

export const VaultSubmissionsSection = () => {
  const { vault } = useContext(VaultDetailsContext);

  return <StyledSubmissionsSection>VaultSubmissionsSection</StyledSubmissionsSection>;
};
