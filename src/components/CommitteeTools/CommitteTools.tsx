import { useContext } from "react";
import Decrypt from "./components/Decrypt/Decrypt";
import classNames from "classnames";
import "./index.scss";
import { VaultProvider, VaultContext } from "./store";
import Welcome from "./components/Welcome/Welcome";
import UnlockVaultModal from "./components/UnlockVaultModal/UnlockVaultModal";


export default function CommitteeTools() {
  return <VaultProvider>
    <Content />
  </VaultProvider>
}


function Content() {
  const vault = useContext(VaultContext);


  const committeeToolsWrapper = classNames({
    'committee-tools-wrapper': true,
    'content': true
  });

  return (
    <div className={committeeToolsWrapper}>
      {(vault.isCreated && vault.isLocked) && <UnlockVaultModal />}
      {vault.isCreated ? <Decrypt /> : <Welcome />}
    </div>
  )
}

