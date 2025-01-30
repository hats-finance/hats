import { Key, MaybeArray, createMessage, encrypt, generateSessionKey, readKey } from "openpgp";
import { getHatsPublicKey } from "./submissionsService.api";

const IpfsHash = require("ipfs-only-hash");

const encryptionCache = new Map<string, string>();

export async function encryptWithKeys(publicKeyOrKeys: string | string[], dataToEncrypt: string): Promise<string> {
  const cacheKey = Array.isArray(publicKeyOrKeys) 
    ? `keys-${dataToEncrypt}-${publicKeyOrKeys.join(',')}`
    : `key-${dataToEncrypt}-${publicKeyOrKeys}`;

  if (encryptionCache.has(cacheKey)) {
    return encryptionCache.get(cacheKey)!;
  }

  try {
    const publicKeys = Array.isArray(publicKeyOrKeys) ? publicKeyOrKeys : [publicKeyOrKeys];
    const validKeys = publicKeys.filter((key): key is string => typeof key === 'string' && key.length > 0);
    
    if (validKeys.length === 0) {
      throw new Error("No valid public keys provided");
    }

    const keys = await Promise.all(validKeys.map((key) => readKey({ armoredKey: key })));

    const encryptedData = await encrypt({
      message: await createMessage({ text: dataToEncrypt }),
      encryptionKeys: keys,
      config: {
        rejectPublicKeyAlgorithms: new Set(),
      },
    });

    const result = encryptedData as string;
    encryptionCache.set(cacheKey, result);
    
    // Limit cache size to prevent memory leaks
    if (encryptionCache.size > 100) {
      const firstKey = Array.from(encryptionCache.keys())[0];
      if (firstKey) {
        encryptionCache.delete(firstKey);
      }
    }

    return result;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}

export async function encryptWithHatsKey(dataToEncrypt: string): Promise<string> {
  const cacheKey = `hats-${dataToEncrypt}`;
  if (encryptionCache.has(cacheKey)) {
    return encryptionCache.get(cacheKey)!;
  }

  try {
    const hatsPublicKeyString = await getHatsPublicKey();
    if (!hatsPublicKeyString || typeof hatsPublicKeyString !== 'string' || hatsPublicKeyString.length === 0) {
      throw new Error("Hats public key not found on server or invalid");
    }

    const hatsPublicKey = await readKey({ armoredKey: hatsPublicKeyString });
    const encryptedData = await encrypt({
      message: await createMessage({ text: dataToEncrypt }),
      encryptionKeys: hatsPublicKey,
      config: {
        rejectPublicKeyAlgorithms: new Set(),
      },
    });

    // Cache the result
    const result = encryptedData as string;
    encryptionCache.set(cacheKey, result);
    
    // Limit cache size to prevent memory leaks
    if (encryptionCache.size > 100) {
      const firstKey = Array.from(encryptionCache.keys())[0];
      if (firstKey) {
        encryptionCache.delete(firstKey);
      }
    }

    return result;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}

// Add a function to clear the cache if needed
export const clearEncryptionCache = () => {
  encryptionCache.clear();
};

// Calculate CID with caching
export async function calcCid(content: string): Promise<string> {
  const cacheKey = `cid-${content}`;
  if (encryptionCache.has(cacheKey)) {
    return encryptionCache.get(cacheKey)!;
  }

  const cid = await IpfsHash.of(content);
  encryptionCache.set(cacheKey, cid);
  return cid;
}
