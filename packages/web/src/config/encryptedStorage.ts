import { EncryptStorage } from "encrypt-storage";
import { ENCRYPTED_STORAGE_KEY } from "settings";

export const encryptedStorage = new EncryptStorage(ENCRYPTED_STORAGE_KEY, { storageType: "sessionStorage" });
