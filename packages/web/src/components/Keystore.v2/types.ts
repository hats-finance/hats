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
  initKeystore: () => Promise<boolean>;
  openKeystore: () => Promise<boolean>;
  selectKey: () => Promise<IStoredKey | undefined>;
  setKeystore: (keystore: IKeystoreData) => void;
  keystore: IKeystoreData | undefined;
  // isLocked: boolean;
  // isCreated: boolean;
  // addKeyToKeystore: (key: IStoredKey) => void;
  // removeKeyFromKeystore: (keyId: string) => void;
  // createNewKeystore: (password: string) => void;
  // deleteCurrentKeystore: () => void;
}

export type IKeystoreActions = "OPEN" | "SELECT" | "INIT";
