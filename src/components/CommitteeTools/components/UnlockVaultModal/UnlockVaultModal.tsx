import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../Shared/Modal";
import { VaultContext } from "../../store";

export default function UnlockVaultModal() {
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>();
    const { t } = useTranslation();
    const vaultContext = useContext(VaultContext);

    const unlockVault = async () => {
        try {
            await vaultContext.unlockVault!(passwordRef.current!.value)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    return (
        <Modal title={t("CommitteeTools.Welcome.unlock-title")} setShowModal={() => { }} height="fit-content" hideClose={true}>
            <label >{t("CommitteeTools.Welcome.password")}</label>
            <input type="password" ref={passwordRef} />
            <button onClick={unlockVault}>Unlock</button>
            {error && <div>{error}</div>}
        </Modal >
    )
}
