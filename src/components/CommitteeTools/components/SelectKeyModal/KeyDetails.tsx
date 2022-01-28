import { PrivateKey } from "openpgp";
import { useEffect, useState } from "react";
import { IStoredKey } from "../../../../types/types";
import CopyToClipboard from "../../../Shared/CopyToClipboard";
import { readPrivateKeyFromStoredKey } from "../Decrypt/Decrypt";

function KeyDetails({ storedKey }: {
    storedKey: IStoredKey
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
            <div>Public Key<CopyToClipboard value={privateKey?.toPublic().armor()} /></div>
            {storedKey.passphrase && <div>Passphrase<CopyToClipboard value={storedKey.passphrase} /></div>}
        </div>)
    } else {
        return (<></>)
    }
}


export default KeyDetails