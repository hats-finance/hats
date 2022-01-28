import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IStoredKey } from "../../../../types/types";
import { VaultContext } from "../../store";
import { readPrivateKeyFromStoredKey } from "../Decrypt/Decrypt";


export default function ImportKey({ onAdded }: { onAdded: (added: IStoredKey) => any }) {
    const vaultContext = useContext(VaultContext)
    const aliasRef = useRef<HTMLInputElement>(null)
    const passphraseRef = useRef<HTMLInputElement>(null)
    const privateKeyRef = useRef<HTMLTextAreaElement>(null)
    const [error, setError] = useState<string>()
    const { t } = useTranslation();

    const addKey = async () => {
        const alias = aliasRef.current!.value
        const privateKey = privateKeyRef.current!.value
        const passphrase = passphraseRef.current!.value

        const toAdd: IStoredKey = { alias, privateKey, passphrase }
        try {
            await readPrivateKeyFromStoredKey(toAdd)
            vaultContext.addKey!(toAdd)
            vaultContext.setSelectedAlias!(toAdd.alias)
            onAdded(toAdd)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
            return
        }
    }

    return <div>
        <h1>{t("CommitteeTools.keymodal.")}</h1>
        <div>
            <label>{t("CommitteeTools.keymodal.alias")}</label>
            <input ref={aliasRef} type="text" placeholder={t("CommitteeTools.keymodal.alias")} />
        </div>
        <div>
            <label>{t("CommitteeTools.keymodal.passphrase")}</label>
            <input ref={passphraseRef} type="text" placeholder={t("CommitteeTools.keymodal.passphrase")} />
        </div>
        <textarea ref={privateKeyRef} cols={80} rows={8} />
        {error && error !== "" && <p>{error}</p>}
        <button onClick={addKey}>{t("CommitteeTools.keymodal.import-button")}</button>
    </div>

}
