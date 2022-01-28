import { PrivateKey } from "openpgp";
import { useEffect, useState } from "react";
import { IStoredKey } from "../../../../types/types";
import CopyToClipboard from "../../../Shared/CopyToClipboard";
import { readPrivateKeyFromStoredKey } from "../Decrypt/Decrypt";

function KeyDetails({ storedKey, onBack }: {
    storedKey: IStoredKey
    onBack: () => any
}) {
    const [privateKey, setPrivateKey] = useState<PrivateKey>();

    useEffect(() => {
        (async () => {
            setPrivateKey(await readPrivateKeyFromStoredKey(storedKey));
        })()
    })
    if (privateKey) {
        return (<div>
            <div>Private Key<CopyToClipboard value={privateKey?.armor()} /></div>
            {storedKey.passphrase && <div>Passphrase<CopyToClipboard value={storedKey.passphrase} /></div>}
            <br></br>
            <div>Public Key<CopyToClipboard value={privateKey?.toPublic().armor()} /></div>
            <button onClick={onBack}>Back</button>
        </div>)
    } else {
        return (<></>)
    }
}


export default KeyDetails