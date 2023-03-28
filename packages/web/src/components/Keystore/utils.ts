import { decryptKey, readPrivateKey } from "openpgp";
import { v4 as uuid } from "uuid";
import { IStoredKey } from "components/Keystore";

export async function readPrivateKeyFromStoredKey(privateKey: string, passphrase: string | undefined) {
  return passphrase
    ? await decryptKey({
        privateKey: await readPrivateKey({ armoredKey: privateKey }),
        passphrase,
      })
    : await readPrivateKey({ armoredKey: privateKey });
}

export function formatKeyWithId(key: IStoredKey): IStoredKey {
  return {
    ...key,
    id: key.id ?? uuid(),
  };
}
