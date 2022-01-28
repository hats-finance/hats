import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../Shared/Modal";
import { VaultContext } from "../../store";

const Welcome = () => {
    const { t } = useTranslation();
    const vaultContext = useContext(VaultContext);
    const [showCreateVault, setShowCreateVault] = useState(false);
    const [showUnlockVault, setShowUnlockVault] = useState(false);


    return <div>
        <h1>{t("CommitteeTools.Welcome.title")}</h1>
        <p>{t("CommitteeTools.Welcome.content")}</p>
        {vaultContext.isCreated ?
            <>
                <button
                    onClick={() => setShowUnlockVault(true)}>{t("CommitteeTools.Welcome.unlock-vault")}</button>
                <button onClick={() => {
                    if (prompt(t("CommitteeTools.Welcome.delete-confirmation")) === t("CommitteeTools.Welcome.delete-yes")) {
                        vaultContext.deleteVault!()
                    }
                }}>{t("CommitteeTools.Welcome.delete-vault")}</button></> :
            <button onClick={() => setShowCreateVault(true)}>{t("CommitteeTools.Welcome.create-vault")}</button>}
        {showCreateVault && <CreateVaultModal setShowModal={setShowCreateVault} />}
        {showUnlockVault && <UnlockVaultModal setShowModal={setShowUnlockVault} />}
    </div>
}

export default Welcome

function CreateVaultModal({ setShowModal }: { setShowModal: (show: boolean) => any }) {
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>();
    const { t } = useTranslation();
    const vault = useContext(VaultContext);

    const createVault = () => {
        if (passwordRef.current!.value !== passwordConfirmRef.current!.value) {
            setError(t("CommitteeTools.Welcome.passwords-mismatch"))
            return
        }
        vault.createVault!(passwordRef.current!.value)
    }

    return (
        <Modal title={t("CommitteeTools.Welcome.create-title")} setShowModal={setShowModal} height="fit-content" >
            <p>{t("CommitteeTools.Welcome.password")}</p>
            <input type="password" ref={passwordRef} />
            <p>{t("CommitteeTools.Welcome.confirm")}</p>
            <input type="password" ref={passwordConfirmRef} />
            <button onClick={createVault}>{t("CommitteeTools.Welcome.create-vault")}</button>
            {error && <div>{error}</div>}
        </Modal >
    )
}


function UnlockVaultModal({ setShowModal }: { setShowModal: (show: boolean) => any }) {
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>();
    const { t } = useTranslation();
    const vault = useContext(VaultContext);

    const unlockVault = async () => {
        try {
            await vault.unlockVault!(passwordRef.current!.value)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    return (
        <Modal title={t("CommitteeTools.Welcome.unlock-title")} setShowModal={setShowModal} height="fit-content" hideClose={true}>
            <label >{t("CommitteeTools.Welcome.password")}</label>
            <input type="password" ref={passwordRef} />
            <button onClick={unlockVault}>Unlock</button>
            {error && <div>{error}</div>}
        </Modal >
    )
}
