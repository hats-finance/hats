import { useContext, useEffect, useState, createContext, useRef, useCallback } from "react";
import { v4 as uuid } from "uuid";
import * as encryptor from "browser-passworder";
import { LocalStorage } from "constants/constants";
import { IStoredKey, IKeystoreContext, IKeystoreData } from "./types";
import { UnlockKeystore } from "./components";

type KeystoreActions = "unlock";

export const KeystoreContext = createContext<IKeystoreContext>(undefined as any);

export function KeystoreProvider({ children }) {
  const [keystore, setKeystore] = useState<IKeystoreData | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [activeActions, setActiveActions] = useState<KeystoreActions[]>([]);
  const isLocked = password === undefined;

  const fnUnlock = useRef<(password: string | undefined) => Promise<void>>();
  const unlockKeystore = useCallback(() => {
    return new Promise<boolean>((res, rej) => {
      setActiveActions(["unlock"]);
      fnUnlock.current = async (password: string | undefined): Promise<void> => {
        if (!password) {
          res(false);
          setActiveActions((prev) => prev.filter((act) => act !== "unlock"));
          return;
        }

        try {
          const decryptedKeystore = await encryptor.decrypt(password, localStorage.getItem(LocalStorage.Keystore));
          setPassword(password);
          setKeystore(decryptedKeystore);
          res(true);
          setActiveActions((prev) => prev.filter((act) => act !== "unlock"));
        } catch (error) {
          throw error;
        }
      };
    });
  }, [setActiveActions]);

  const addKeyToKeystore = (newKey: IStoredKey) => {
    // Check alias validation
    if (!newKey.alias || newKey.alias === "") throw new Error("Alias cannot be empty");

    // Check if alias already exists
    const aliasExists = keystore?.storedKeys.find((key) => key.alias === newKey.alias);
    if (aliasExists) throw new Error(`Key with alias ${newKey.alias} already exists`);

    // Check if key already exists
    const keyExists = keystore?.storedKeys.find((key) => key.privateKey === newKey.privateKey);
    if (keyExists) throw new Error(`That key is already present in your keystore`);

    const newKeyToAdd = { ...newKey, id: uuid() };

    setKeystore((prev) => ({ ...prev!, storedKeys: [...prev!.storedKeys, newKeyToAdd] }));
  };

  const removeKeyFromKeystore = (keyId: string) => {
    setKeystore((prev) => ({
      ...prev,
      storedKeys: prev!.storedKeys!.filter((k) => k.id !== keyId),
    }));
  };

  const deleteCurrentKeystore = () => {
    localStorage.removeItem(LocalStorage.Keystore);
    setKeystore(undefined);
    setPassword(undefined);
  };

  // const unlockCurrentKeystore = async (password: string): Promise<boolean> => {
  //   try {
  //     const decryptedKeystore = await encryptor.decrypt(password, localStorage.getItem(LocalStorage.Keystore));
  //     setPassword(password);
  //     setKeystore(decryptedKeystore);
  //     return true;
  //   } catch (error) {
  //     throw new Error(error as string);
  //   }
  // };

  // -------------------------------
  // MIGRATED
  const createNewKeystore = (password: string) => {
    setPassword(password);
    setKeystore({ storedKeys: [] });
  };

  const selectPgpKey = async (): Promise<IStoredKey | undefined> => {
    if (!isCreated) {
      // TODO: implement this
    }

    if (isLocked) {
      const wasUnlocked = await unlockKeystore();
      console.log("wasUnlocked", wasUnlocked);
      if (!wasUnlocked) return undefined;
    }

    return undefined;
  };

  // Save changes to localStorage
  useEffect(() => {
    const saveKeystoreChanges = async () => {
      if (password && keystore) {
        const encrypted = await encryptor.encrypt(password, keystore);
        localStorage.setItem(LocalStorage.Keystore, encrypted);
        setIsCreated(true);
      }
    };
    saveKeystoreChanges();
  }, [keystore, password]);

  // Verify if keystore is already created
  useEffect(() => {
    if (localStorage.getItem(LocalStorage.Keystore)) setIsCreated(true);
  }, []);

  return (
    <KeystoreContext.Provider
      value={{
        keystore,
        selectPgpKey,
      }}
    >
      {children}
      <UnlockKeystore
        isShowing={activeActions.includes("unlock")}
        onClose={() => fnUnlock.current?.(undefined)}
        onUnlockKeystore={(pass) => fnUnlock.current?.(pass)}
      />
    </KeystoreContext.Provider>
  );
}

export function useKeystore() {
  return useContext(KeystoreContext);
}
