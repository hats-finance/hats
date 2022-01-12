import { IStoredKey } from "../../types/types";
import { decryptKey, PrivateKey, readPrivateKey } from "openpgp";
import { useEffect, useState } from "react";



export async function readPrivateKeyFromStoredKey({ passphrase, privateKey }: IStoredKey) {
    return passphrase ? await decryptKey({
        privateKey: await readPrivateKey({ armoredKey: privateKey }),
        passphrase
    }) : await readPrivateKey({ armoredKey: privateKey })
}

// loads asynchronously
export function usePrivateKey(storedKey: IStoredKey): PrivateKey | undefined {
    const [privateKey, setPrivateKey] = useState<PrivateKey>()
    useEffect(() => {
        // we make sure its only done once and not on each render
        (async () => {
            setPrivateKey(await readPrivateKeyFromStoredKey(storedKey))
        })()
    })

    return privateKey
}