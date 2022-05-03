import { useContext } from "react";
import Decrypt from "./components/Decrypt/Decrypt";
import { VaultProvider, VaultContext } from "./store";
import Welcome from "./components/Welcome/Welcome";
import UnlockVaultModal from "./components/UnlockVaultModal/UnlockVaultModal";
import "./index.scss";

export default function CommitteeTools() {
  return (
    <VaultProvider>
      <Content />
    </VaultProvider>
  );
}

function Content() {
  const vault = useContext(VaultContext);

  return (
    <div className="content committee-tools-wrapper">
      <div className="committee-tools-content">
        {vault.isCreated && vault.isLocked && <UnlockVaultModal setShowModal={() => { }} />}
        {vault.isCreated ? <Decrypt /> : <Welcome />}
      </div>
    </div>
  );
}
