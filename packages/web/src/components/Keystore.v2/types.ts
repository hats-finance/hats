export interface IStoredKey {
  id?: string;
  alias: string;
  privateKey: string;
  publicKey: string;
  passphrase?: string | undefined;
}

export interface IKeystoreData {
  storedKeys: IStoredKey[];
}

export interface IKeystoreContext {
  keystore: IKeystoreData | undefined;
  selectPgpKey: () => Promise<IStoredKey | undefined>;
  // isLocked: boolean;
  // isCreated: boolean;
  // addKeyToKeystore: (key: IStoredKey) => void;
  // removeKeyFromKeystore: (keyId: string) => void;
  // createNewKeystore: (password: string) => void;
  // deleteCurrentKeystore: () => void;
}
