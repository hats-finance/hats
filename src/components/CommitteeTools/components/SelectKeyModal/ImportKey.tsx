import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IStoredKey } from "../../../../types/types";
import { VaultContext } from "../../store";
import { readPrivateKeyFromStoredKey } from "../Decrypt/Decrypt";
import PastableContent from "../PastableContent/PastableContent";


export default function ImportKey({ onFinish }: { onFinish: () => any }) {
    const vaultContext = useContext(VaultContext)
    const aliasRef = useRef<HTMLInputElement>(null)
    const passphraseRef = useRef<HTMLInputElement>(null)
    const privateKeyRef = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string>()
    const { t } = useTranslation();

    const addKey = async () => {
        const alias = aliasRef.current!.value
        const privateKey = privateKeyRef.current!.textContent!
        console.log("privatekey", privateKey)
        const passphrase = passphraseRef.current!.value

        const toAdd: IStoredKey = { alias, privateKey, passphrase }
        try {
            if (toAdd.privateKey === "")
                throw new Error(t("CommitteeTools.ImportKey.no-key-error"))
            await readPrivateKeyFromStoredKey(toAdd)
            vaultContext.addKey!(toAdd)
            vaultContext.setSelectedAlias!(toAdd.alias)
            onFinish()
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
            return
        }
    }

    return <div>
        <p>{t("CommitteeTools.keymodal.import-text")}</p>
        <label>{t("CommitteeTools.keymodal.alias")}</label>
        <input ref={aliasRef} type="text" placeholder={t("CommitteeTools.keymodal.alias")} />
        <label>{t("CommitteeTools.keymodal.passphrase")}</label>
        <input ref={passphraseRef} type="text" placeholder={t("CommitteeTools.keymodal.passphrase")} />
        <label>{t("CommitteeTools.keymodal.private-key")}</label>
        <PastableContent ref={privateKeyRef} placeholder={t("Comitteee")} />
        {error && error !== "" && <p>{error}</p>}
        <button onClick={addKey}>
            {t("CommitteeTools.keymodal.import-button")}</button>
    </div>

}
