import { decrypt, readMessage, readPrivateKey } from "openpgp";
import { BACKEND_PRIVATE_KEY } from "settings";

export const decryptUsingHatsKey = async (encryptedData: string): Promise<string | undefined> => {
  try {
    const privateKey = await readPrivateKey({ armoredKey: BACKEND_PRIVATE_KEY });
    const message = await readMessage({ armoredMessage: encryptedData });

    const { data: decrypted } = await decrypt({
      message,
      decryptionKeys: privateKey,
    });

    return decrypted as string;
  } catch (error) {
    return undefined;
  }
};
