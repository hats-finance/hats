import { Key, MaybeArray, createMessage, encrypt, generateSessionKey, readKey } from "openpgp";
import { getHatsPublicKey } from "./submissionsService.api";

const IpfsHash = require("ipfs-only-hash");

export async function encryptWithKeys(publicKeyOrKeys: string | string[], dataToEncrypt: string) {
  let encryptionKeys: MaybeArray<Key>;

  if (Array.isArray(publicKeyOrKeys)) {
    encryptionKeys = [];

    const encryptionKeysList = await Promise.all(publicKeyOrKeys.map((key) => readKey({ armoredKey: key })));
    for (let key of encryptionKeysList) {
      try {
        await key.verifyPrimaryKey();
        encryptionKeys.push(key);
      } catch {
        continue;
      }
    }

    if (encryptionKeys.length === 0) return undefined;
  } else {
    encryptionKeys = await readKey({ armoredKey: publicKeyOrKeys });

    try {
      await encryptionKeys.verifyPrimaryKey();
    } catch (error) {
      return undefined;
    }
  }

  const sessionKey = await generateSessionKey({ encryptionKeys });
  const encryptedData = await encrypt({
    message: await createMessage({ text: dataToEncrypt }),
    encryptionKeys,
    sessionKey,
  });
  return { encryptedData, sessionKey };
}

export async function encryptWithHatsKey(dataToEncrypt: string): Promise<string> {
  try {
    const hatsPublicKeyString = await getHatsPublicKey();
    if (!hatsPublicKeyString) throw new Error("Hats public key not found on server");

    const hatsPublicKey = await readKey({ armoredKey: hatsPublicKeyString });
    const encryptedData = await encrypt({
      message: await createMessage({ text: dataToEncrypt }),
      encryptionKeys: hatsPublicKey,
    });

    return encryptedData as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function calcCid(content) {
  return await IpfsHash.of(content);
}
