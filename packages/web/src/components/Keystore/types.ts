import { Dispatch, SetStateAction } from "react";

export type IKeystoreManagerActions = "create" | "unlock" | "select_publickey" | "dashboard";
export type IKeystoreActions = "OPEN" | "SELECT_PUBLICKEY" | "INIT";

export interface IStoredKey {
  id?: string;
  alias: string;
  privateKey: string;
  publicKey: string;
  passphrase?: string | undefined;
  createdAt?: Date;
}

export interface IKeystoreData {
  storedKeys: IStoredKey[];
}

export interface IKeystoreContext {
  initKeystore: () => Promise<boolean>;
  openKeystore: () => Promise<boolean>;
  selectPublicKey: () => Promise<string | undefined>;
  setKeystore: Dispatch<SetStateAction<IKeystoreData | undefined>>;
  keystore: IKeystoreData | undefined;
}
