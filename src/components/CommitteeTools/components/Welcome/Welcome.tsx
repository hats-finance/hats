import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../Shared/Modal";
import Vault from "../../../Vault/Vault";
import { VaultContext } from "../../store";

const Welcome = () => {
    const { t } = useTranslation();
    const vault = useContext(VaultContext);
    const [showCreateVault, setShowCreateVault] = useState(false);
    const [showUnlockVault, setShowUnlockVault] = useState(false);


    return <div>
        <h1>{t("CommitteeTools.Welcome.title")}</h1>
        <p>{t("CommitteeTools.Welcome.content")}</p>
        {vault.isCreated ?
            <><button
                onClick={() => setShowUnlockVault(true)}>Unlock Vault
            </button><button>Delete Vault</button></> :
            <button onClick={() => setShowCreateVault(true)}>Create Vault</button>}
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
            setError("Passwords mismatch")
            return
        }
        vault.createVault!(passwordRef.current!.value)
    }

    return (
        <Modal title="Create Vault" setShowModal={setShowModal} height="283px" >
            <p>{t("CommitteeTools.enter-password")}</p>
            <input type="password" ref={passwordRef} />
            <p>Confirm</p>
            <input type="password" ref={passwordConfirmRef} />
            <button onClick={createVault}></button>
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
        <Modal title="Unlock Vault" setShowModal={setShowModal} height="fit-content" hideClose={true}>
            <label >{t("CommitteeTools.enter-password")}</label>
            <input type="password" ref={passwordRef} />
            <button onClick={unlockVault}>Unlock</button>
            {error && <div>{error}</div>}
        </Modal >
    )
}
