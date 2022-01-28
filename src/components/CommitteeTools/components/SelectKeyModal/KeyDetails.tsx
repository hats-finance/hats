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


    return (
        <div>
            <p>Private Key<CopyToClipboard value={privateKey?.armor()} /></p>
            <p>Public Key<CopyToClipboard value={privateKey?.toPublic().armor()} /></p>
            {storedKey.passphrase && <p>Passphrase<CopyToClipboard value={storedKey.passphrase} /></p>}
        </div>
    );
}


export default KeyDetails