import { decrypt, decryptKey, PrivateKey, readMessage, readPrivateKey } from "openpgp";
import { useEffect, useRef, useState } from "react";
import { IStoredKey } from "../../types/types";

export default function Decrypt({ storedKey }: { storedKey: IStoredKey }) {
    const [privateKey, setPrivateKey] = useState<PrivateKey>()

    const encryptedMessageRef = useRef<HTMLTextAreaElement>(null)
    const decryptedMessageRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        (async () => {
            setPrivateKey(storedKey.passphrase ? await decryptKey({
                privateKey: await readPrivateKey({ armoredKey: storedKey.privateKey }),
                passphrase: storedKey.passphrase
            }) : await readPrivateKey({ armoredKey: storedKey.privateKey }))
        })()
    })

    async function _decrypt() {
        const message = await readMessage({ armoredMessage: encryptedMessageRef.current!.value })
        const { data: decrypted } = await decrypt({ message, decryptionKeys: privateKey })
        decryptedMessageRef.current!.value = decrypted
    }

    return <div>
        <div>
            <p>Encrypted message</p>
            <textarea ref={encryptedMessageRef} cols={80} rows={15} />

            <div><button onClick={_decrypt}>Decrypt</button></div>
            <p>Decrypted message</p>
            <textarea ref={decryptedMessageRef} cols={80} rows={15} />
        </div>
    </div>
}