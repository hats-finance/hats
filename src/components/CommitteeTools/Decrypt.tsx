import { decrypt, PrivateKey, readMessage } from "openpgp";
import { useCallback, useEffect, useRef, useState } from "react";
import { IStoredKey } from "../../types/types";
import CopyToClipboard from "../Shared/CopyToClipboard";
import Modal from "../Shared/Modal";
import { usePrivateKey } from "./util";

export default function Decrypt({ storedKey }: { storedKey: IStoredKey }) {
    const privateKey = usePrivateKey(storedKey)
    const [showKeyDetails, setShowKeyDetails] = useState(false)
    const encryptedMessageRef = useRef<HTMLTextAreaElement>(null)
    const decryptedMessageRef = useRef<HTMLTextAreaElement>(null)

    const _decrypt = useCallback(async () => {
        const message = await readMessage({ armoredMessage: encryptedMessageRef.current!.value })
        const { data: decrypted } = await decrypt({ message, decryptionKeys: privateKey })
        decryptedMessageRef.current!.value = decrypted
    }, [privateKey])

    if (!privateKey) return <></>

    return <div>
        <div>
            <button onClick={() => setShowKeyDetails(true)}>show key details</button>
            {showKeyDetails && <Modal
                title="Key Details"
                setShowModal={setShowKeyDetails}
            >
                <KeyDetails storedKey={storedKey} privateKey={privateKey} />
            </Modal>}
            <p>Encrypted message</p>
            <textarea ref={encryptedMessageRef} cols={80} rows={15} />

            <div><button onClick={_decrypt}>Decrypt</button></div>
            <p>Decrypted message</p>
            <textarea ref={decryptedMessageRef} cols={80} rows={15} />
        </div>
    </div>
}


function KeyDetails({ storedKey, privateKey }: {
    storedKey: IStoredKey
    privateKey: PrivateKey
}) {
    return <div>
        <p>Private Key<CopyToClipboard value={privateKey.armor()} /></p>
        <p>Public Key<CopyToClipboard value={privateKey.toPublic().armor()} /></p>
        {storedKey.passphrase && <p>Passphrase<CopyToClipboard value={storedKey.passphrase} /></p>}
    </div>
}