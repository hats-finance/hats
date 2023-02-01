import { decryptKey, readPrivateKey } from "openpgp";

export async function readPrivateKeyFromStoredKey(
    privateKey: string,
    passphrase: string | undefined
) {
    return passphrase
        ? await decryptKey({
            privateKey: await readPrivateKey({ armoredKey: privateKey }),
            passphrase
        })
        : await readPrivateKey({ armoredKey: privateKey });
}
