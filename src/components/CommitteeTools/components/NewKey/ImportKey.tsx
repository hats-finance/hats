import { useContext, useRef, useState } from "react";
import { IStoredKey } from "../../../../types/types";
import { VaultContext } from "../../store";
import { readPrivateKeyFromStoredKey } from "../Decrypt/Decrypt";


const ExportKey = ({ onAdded }: { onAdded: (added: IStoredKey) => any }) => {
    const vaultContext = useContext(VaultContext)
    const aliasRef = useRef<HTMLInputElement>(null)
    const passphraseRef = useRef<HTMLInputElement>(null)
    const privateKeyRef = useRef<HTMLTextAreaElement>(null)
    const [error, setError] = useState<string>()

    const addKey = async () => {
        const alias = aliasRef.current!.value
        const privateKey = privateKeyRef.current!.value
        const passphrase = passphraseRef.current!.value

        const toAdd: IStoredKey = { alias, privateKey, passphrase }
        try {
            const attempt = await readPrivateKeyFromStoredKey(toAdd)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
            return
        }
        vaultContext.addKey!(toAdd)
    }

    return <div>
        <h1>Import keypair</h1>
        <input ref={aliasRef} type="text" placeholder="alias" />
        <input ref={passphraseRef} type="text" placeholder="alias" />
        <textarea ref={privateKeyRef} cols={80} rows={8} />
        {error && error !== "" && <p>{error}</p>}
        <button onClick={addKey}>Import</button>
    </div>

}

export default ExportKey