import { useContext } from "react";
import Decrypt from "./components/Decrypt/Decrypt";
import classNames from "classnames";
import "./index.scss";
import Welcome from "./components/Welcome/Welcome";
import { VaultProvider, VaultContext } from "./store";


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
      {vault.isLocked ? <Welcome /> : <Decrypt />}
    </div>
  )
}

