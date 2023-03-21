import { useCallback, useEffect, useRef, useState } from "react";
import * as encryptor from "browser-passworder";
import { LocalStorage } from "constants/constants";
import { CreateKeystore, KeysDashboard, UnlockKeystore } from "./components";
import { IKeystoreActions, IKeystoreData, IStoredKey } from "./types";
import { useKeystore } from "./KeystoreProvider";

type KeystoreActions = "create" | "unlock" | "select" | "dashboard";

type KeystoreManagerProps = {
  mode: IKeystoreActions | undefined;
  onSelectedKey?: (key: IStoredKey | undefined) => Promise<void> | undefined;
  onOpenedKeystore?: (success: boolean) => Promise<void> | undefined;
  onInitializedKeystore?: (success: boolean) => Promise<void> | undefined;
};

export const KeystoreManager = ({ mode, onSelectedKey, onOpenedKeystore, onInitializedKeystore }: KeystoreManagerProps) => {
  const [activeAction, setActiveAction] = useState<KeystoreActions | undefined>(undefined);

  const { keystore, setKeystore } = useKeystore();
  const [password, setPassword] = useState<string | undefined>(undefined);

  const isCreated = localStorage.getItem(LocalStorage.Keystore);
  const isLocked = password === undefined;

  const removeActiveAction = () => setActiveAction(undefined);

  // Run actions based on mode
  useEffect(() => {
    const runActions = async () => {
      if (mode === "INIT") {
        const success = await initKeystore();
        if (onInitializedKeystore) onInitializedKeystore(success);
      }

      if (mode === "OPEN") {
        const success = await openKeystore();
        if (onOpenedKeystore) onOpenedKeystore(success);
      }

      if (mode === "SELECT") {
        const selectedKey = await selectKey();
        if (onSelectedKey) onSelectedKey(selectedKey);
      }
    };

    runActions();
  }, [mode, onInitializedKeystore, onOpenedKeystore, onSelectedKey]);

  // Save changes to localStorage
  useEffect(() => {
    const saveKeystoreChanges = async () => {
      if (password && keystore) {
        const encrypted = await encryptor.encrypt(password, keystore);
        localStorage.setItem(LocalStorage.Keystore, encrypted);
      }
    };
    saveKeystoreChanges();
  }, [keystore, password]);

  // Unlock keystore and resolver
  const unlockKeystoreResolver = useRef<(password: string | undefined) => Promise<void>>();
  const unlockKeystore = useCallback((): Promise<IKeystoreData | undefined> => {
    return new Promise<IKeystoreData | undefined>((resolve) => {
      setActiveAction("unlock");
      unlockKeystoreResolver.current = async (password: string | undefined): Promise<void> => {
        if (!password) {
          resolve(undefined);
          removeActiveAction();
          return;
        }

        try {
          const decryptedKeystore: IKeystoreData = await encryptor.decrypt(password, localStorage.getItem(LocalStorage.Keystore));
          setPassword(password);
          setKeystore(decryptedKeystore);
          resolve(decryptedKeystore);
          removeActiveAction();
        } catch (error) {
          throw error;
        }
      };
    });
  }, [setActiveAction, setPassword, setKeystore]);

  // Create keystore and resolver
  const createKeystoreResolver = useRef<(password: string | undefined) => Promise<void>>();
  const createKeystore = useCallback((): Promise<IKeystoreData | undefined> => {
    return new Promise<IKeystoreData | undefined>((resolve) => {
      setActiveAction("create");
      createKeystoreResolver.current = async (password: string | undefined): Promise<void> => {
        if (!password) {
          resolve(undefined);
          removeActiveAction();
          return;
        }

        const newKeystore: IKeystoreData = { storedKeys: [] };

        setPassword(password);
        setKeystore(newKeystore);
        resolve(newKeystore);
        removeActiveAction();
      };
    });
  }, [setActiveAction, setPassword, setKeystore]);

  // -------------------------------------------
  // ----------------- Actions -----------------
  const initKeystore = async (): Promise<boolean> => {
    if (!isCreated) {
      const wasCreated = await createKeystore();
      console.log("wasCreated", wasCreated);
      if (!wasCreated) return false;
    } else if (isLocked) {
      const wasUnlocked = await unlockKeystore();
      console.log("wasUnlocked", wasUnlocked);
      if (!wasUnlocked) return false;
    }

    return true;
  };

  const openKeystore = async (): Promise<boolean> => {
    if (!isCreated) {
      const wasCreated = await createKeystore();
      console.log("wasCreated", wasCreated);
      if (!wasCreated) return false;
    } else if (isLocked) {
      const wasUnlocked = await unlockKeystore();
      console.log("wasUnlocked", wasUnlocked);
      if (!wasUnlocked) return false;
    }

    setActiveAction("dashboard");
    return true;
  };

  const selectKey = async (): Promise<IStoredKey | undefined> => {
    if (!isCreated) {
      const wasCreated = await createKeystore();
      console.log("wasCreated", wasCreated);
      if (!wasCreated) return undefined;
    } else if (isLocked) {
      const wasUnlocked = await unlockKeystore();
      console.log("wasUnlocked", wasUnlocked);
      if (!wasUnlocked) return undefined;
    }

    return undefined;
  };

  return (
    <>
      {activeAction === "unlock" && (
        <UnlockKeystore
          onClose={() => unlockKeystoreResolver.current?.(undefined)}
          onUnlockKeystore={(pass) => unlockKeystoreResolver.current?.(pass)}
        />
      )}
      {activeAction === "create" && (
        <CreateKeystore
          onClose={() => createKeystoreResolver.current?.(undefined)}
          onCreateKeystore={(pass) => createKeystoreResolver.current?.(pass)}
        />
      )}
      {activeAction === "dashboard" && <KeysDashboard onClose={removeActiveAction} />}
    </>
  );
};
