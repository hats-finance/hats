import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../Shared/Modal";
import { VaultContext } from "../../store"

export default function CreateVaultModal({ setShowModal }: { setShowModal: (show: boolean) => any }) {
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>();
    const { t } = useTranslation();
    const vaultContext = useContext(VaultContext);

    const createVault = () => {
        if (passwordRef.current!.value !== passwordConfirmRef.current!.value) {
            setError(t("CommitteeTools.Welcome.passwords-mismatch"))
            return
        }
        vaultContext.createVault!(passwordRef.current!.value)
    }

    return (
        <Modal title={t("CommitteeTools.Welcome.create-title")} setShowModal={setShowModal} height="fit-content" >
            <p>{t("CommitteeTools.Welcome.password")}</p>
            <input type="password" ref={passwordRef} placeholder={t("CommitteeTools.Welcome.create-password-placeholder")} />
            <p>{t("CommitteeTools.Welcome.confirm")}</p>
            <input type="password" ref={passwordConfirmRef} placeholder={t("CommitteeTools.Welcome.create-retype-placeholder")} />
            <button onClick={createVault}>{t("CommitteeTools.Welcome.create-vault")}</button>
            <p className="addenum">{t("CommitteeTools.Welcome.create-addenum")}</p>
            {error && <div>{error}</div>}
        </Modal >
    )
}