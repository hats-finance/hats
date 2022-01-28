import { useContext, useEffect, useRef, useState } from "react";
import Decrypt from "./components/Decrypt/Decrypt";
import classNames from "classnames";
import Modal from "../Shared/Modal";
import { useTranslation } from "react-i18next";
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

  // useEffect(() => {
  //   // vault must be created
  //   if (!vault?.vault) {
  //     setShowCreateVault(true)
  //   } else {
  //     setShowUnlockVault(true)
  //   }
  // }, [vault])


  return (
    <div className={committeeToolsWrapper}>
      {vault.isLocked ? <Welcome /> : <Decrypt />}
    </div>
  )
}

