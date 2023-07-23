import { Key, MaybeArray, createMessage, encrypt, generateSessionKey, readKey } from "openpgp";

const IpfsHash = require("ipfs-only-hash");

export async function encryptWithKeys(publicKeyOrKeys: string | string[], dataToEncrypt: string) {
  let encryptionKeys: MaybeArray<Key>;
  if (Array.isArray(publicKeyOrKeys)) {
    const encryptionKeysList = await Promise.all(publicKeyOrKeys.map((key) => readKey({ armoredKey: key })));
    encryptionKeys = [];
    for (let key of encryptionKeys) {
      try {
        await key.verifyPrimaryKey();
        encryptionKeys.push(key);
      } catch {
      }
    }

    if (encryptionKeys.length == 0) {
      alert("This vault doesn’t have any valid key, please contact hats team");
    }
  } else {
    encryptionKeys = await readKey({ armoredKey: publicKeyOrKeys });
  }
  const sessionKey = await generateSessionKey({ encryptionKeys });
  const encryptedData = await encrypt({
    message: await createMessage({ text: dataToEncrypt }),
    encryptionKeys,
    sessionKey,
  });
  return { encryptedData, sessionKey };
}

export async function calcCid(content) {
  return await IpfsHash.of(content);
}
