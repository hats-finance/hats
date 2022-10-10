import { useContext } from "react";
import { VaultProvider, VaultContext } from "./store";
import Decrypt from "./Decrypt/Decrypt";
import Welcome from "./Welcome/Welcome";
import UnlockVaultModal from "./UnlockVaultModal/UnlockVaultModal";
import { StyledCommitteeToolsPage } from "./styles";

const CommitteeToolsPage = () => {
  const vault = useContext(VaultContext);

  return (
    <VaultProvider>
      <StyledCommitteeToolsPage className="content-wrapper">
        <div className="committee-tools-content">
          {vault.isCreated && vault.isLocked && <UnlockVaultModal setShowModal={() => {}} />}
          {vault.isCreated ? <Decrypt /> : <Welcome />}
        </div>
      </StyledCommitteeToolsPage>
    </VaultProvider>
  );
}

export { CommitteeToolsPage };
