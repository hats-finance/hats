import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import * as encryptor from "browser-passworder";
import { LocalStorage, SessionStorage } from "constants/constants";
import { CreateKeystore, KeystoreDashboard, SelectPublicKey, UnlockKeystore } from "./components";
import { IKeystoreActions, IKeystoreData, IKeystoreManagerActions } from "./types";
import { useKeystore } from "./KeystoreProvider";

type KeystoreManagerProps = {
  mode: IKeystoreActions | undefined;
  setIsKeystoreCreated: Dispatch<SetStateAction<boolean>>;
  setIsKeystoreLoaded: Dispatch<SetStateAction<boolean>>;
  onSelectedPublicKey?: (key: string | undefined) => Promise<void> | undefined;
  onOpenedKeystore?: (success: boolean) => Promise<void> | undefined;
  onInitializedKeystore?: (success: boolean) => Promise<void> | undefined;
};

export const KeystoreManager = ({
  mode,
  setIsKeystoreCreated,
  setIsKeystoreLoaded,
  onSelectedPublicKey,
  onOpenedKeystore,
  onInitializedKeystore,
}: KeystoreManagerProps) => {
  const [activeActions, setActiveActions] = useState<IKeystoreManagerActions[]>([]);
  const removeActiveAction = (action: IKeystoreManagerActions) => setActiveActions((prev) => prev.filter((a) => a !== action));
  const addActiveAction = (action: IKeystoreManagerActions) => setActiveActions((prev) => [...prev, action]);

  const { keystore, setKeystore, isKeystoreCreated } = useKeystore();
  const [password, setPassword] = useState<string | undefined>(undefined);

  const isLocked = password === undefined;

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

      if (mode === "SELECT_PUBLICKEY") {
        const selectedPublicKey = await selectPublicKey();
        if (onSelectedPublicKey) onSelectedPublicKey(selectedPublicKey);
      }
    };

    runActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, onInitializedKeystore, onOpenedKeystore, onSelectedPublicKey]);

  // Save changes to localStorage
  useEffect(() => {
    const saveKeystoreChanges = async () => {
      if (password && keystore) {
        const encrypted = await encryptor.encrypt(password, keystore);
        localStorage.setItem(LocalStorage.Keystore, encrypted);
        sessionStorage.setItem(SessionStorage.KeystorePassword, password);
      }
    };
    saveKeystoreChanges();
  }, [keystore, password]);

  // Check sessionStorage for password
  useEffect(() => {
    const checkSessionStorage = async () => {
      const passwordOnSessionStorage = sessionStorage.getItem(SessionStorage.KeystorePassword);

      if (passwordOnSessionStorage) {
        try {
          const decryptedKeystore: IKeystoreData = await encryptor.decrypt(
            passwordOnSessionStorage,
            localStorage.getItem(LocalStorage.Keystore)
          );
          setPassword(passwordOnSessionStorage);
          setKeystore(decryptedKeystore);
        } catch (error) {
          setPassword(undefined);
          setKeystore(undefined);
        } finally {
          setIsKeystoreLoaded(true);
        }
      } else {
        setIsKeystoreLoaded(true);
      }
    };

    checkSessionStorage();
  }, [setKeystore, setIsKeystoreLoaded]);

  // Unlock keystore and resolver
  const unlockKeystoreResolver = useRef<(password: string | undefined) => Promise<void>>();
  const unlockKeystoreHandler = useCallback((): Promise<IKeystoreData | undefined> => {
    return new Promise<IKeystoreData | undefined>((resolve) => {
      addActiveAction("unlock");
      unlockKeystoreResolver.current = async (password: string | undefined): Promise<void> => {
        if (!password) {
          resolve(undefined);
          removeActiveAction("unlock");
          return;
        }

        try {
          const decryptedKeystore: IKeystoreData = await encryptor.decrypt(password, localStorage.getItem(LocalStorage.Keystore));
          setPassword(password);
          setKeystore(decryptedKeystore);
          resolve(decryptedKeystore);
          removeActiveAction("unlock");
        } catch (error) {
          throw error;
        }
      };
    });
  }, [setPassword, setKeystore]);

  // Create keystore and resolver
  const createKeystoreResolver = useRef<(password: string | undefined) => Promise<void>>();
  const createKeystoreHandler = useCallback((): Promise<IKeystoreData | undefined> => {
    return new Promise<IKeystoreData | undefined>((resolve) => {
      addActiveAction("create");
      createKeystoreResolver.current = async (password: string | undefined): Promise<void> => {
        if (!password) {
          resolve(undefined);
          removeActiveAction("create");
          return;
        }

        const newKeystore: IKeystoreData = { storedKeys: [] };

        setPassword(password);
        setKeystore(newKeystore);
        setIsKeystoreCreated(true);
        resolve(newKeystore);
        removeActiveAction("create");
      };
    });
  }, [setPassword, setKeystore, setIsKeystoreCreated]);

  // Create keystore and resolver
  const selectPublicKeyResolver = useRef<(key: string | undefined) => Promise<void>>();
  const selectPublicKeyHandler = useCallback((): Promise<string | undefined> => {
    return new Promise<string | undefined>((resolve) => {
      addActiveAction("select_publickey");
      selectPublicKeyResolver.current = async (key: string | undefined): Promise<void> => {
        if (!key) {
          resolve(undefined);
          removeActiveAction("select_publickey");
          return;
        }

        resolve(key);
        removeActiveAction("select_publickey");
      };
    });
  }, []);

  // -------------------------------------------
  // ----------------- Actions -----------------
  const initKeystore = async (openOnSuccess?: IKeystoreManagerActions): Promise<boolean> => {
    if (!isKeystoreCreated) {
      const wasCreated = await createKeystoreHandler();
      if (!wasCreated) return false;
    } else if (isLocked) {
      const wasUnlocked = await unlockKeystoreHandler();
      if (!wasUnlocked) return false;
    }

    if (openOnSuccess) addActiveAction(openOnSuccess);
    return true;
  };

  const openKeystore = async (): Promise<boolean> => {
    const wasOpened = await initKeystore("dashboard");
    return wasOpened;
  };

  const selectPublicKey = async (): Promise<string | undefined> => {
    const selectedPublicKey = await selectPublicKeyHandler();
    return selectedPublicKey;
  };

  return (
    <>
      {activeActions.includes("dashboard") && <KeystoreDashboard onClose={() => removeActiveAction("dashboard")} />}
      {activeActions.includes("select_publickey") && (
        <SelectPublicKey
          initKeystore={initKeystore}
          onClose={() => selectPublicKeyResolver.current?.(undefined)}
          onPublicKeySelected={(publickey) => selectPublicKeyResolver.current?.(publickey)}
        />
      )}
      {activeActions.includes("unlock") && (
        <UnlockKeystore
          onClose={() => unlockKeystoreResolver.current?.(undefined)}
          onKeystoreUnlocked={(pass) => unlockKeystoreResolver.current?.(pass)}
        />
      )}
      {activeActions.includes("create") && (
        <CreateKeystore
          onClose={() => createKeystoreResolver.current?.(undefined)}
          onKeystoreCreated={(pass) => createKeystoreResolver.current?.(pass)}
        />
      )}
    </>
  );
};
