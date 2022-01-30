import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { VaultContext } from "../../store"
import CreateVaultModal from "../CreateVaultModal/CreateVaultModal";

const Welcome = () => {
    const { t } = useTranslation();
    const vaultContext = useContext(VaultContext);
    const [showCreateVault, setShowCreateVault] = useState(false);

    return <div>
        <h1>{t("CommitteeTools.Welcome.title")}</h1>
        <p>{t("CommitteeTools.Welcome.content")}</p>
        {vaultContext.isCreated ?
            <>
                <button onClick={() => {
                    if (prompt(t("CommitteeTools.Welcome.delete-confirmation")) === t("CommitteeTools.Welcome.delete-yes")) {
                        vaultContext.deleteVault!()
                    }
                }}>{t("CommitteeTools.Welcome.delete-vault")}</button></> :
            <button onClick={() => setShowCreateVault(true)}>{t("CommitteeTools.Welcome.create-vault")}</button>}
        {showCreateVault && <CreateVaultModal setShowModal={setShowCreateVault} />}
    </div>
}

export default Welcome