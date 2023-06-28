import { EncryptStorage } from "encrypt-storage";

// Generate a cryptographically secure random key
const array = new Uint32Array(10);
window.crypto.getRandomValues(array);
const encryptionKey = Array.from(array).join("");

export const encryptedStorage = new EncryptStorage(encryptionKey, { storageType: "sessionStorage" });
