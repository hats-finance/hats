import { EncryptStorage } from "encrypt-storage";
import { ENCRYPTED_STORAGE_KEY } from "settings";

export const encryptedStorage = new EncryptStorage(ENCRYPTED_STORAGE_KEY?ENCRYPTED_STORAGE_KEY:"hjsdfhkjfhfkju4567834687345", { storageType: "sessionStorage" });
