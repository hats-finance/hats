import { useContext, useState, createContext, useRef, useCallback } from "react";
import { KeystoreManager } from "./KeystoreManager";
import { IStoredKey, IKeystoreContext, IKeystoreActions, IKeystoreData } from "./types";

export const KeystoreContext = createContext<IKeystoreContext>(undefined as any);

export function KeystoreProvider({ children }) {
  const [activeMode, setActiveMode] = useState<IKeystoreActions | undefined>();
  const [keystore, setKeystore] = useState<IKeystoreData | undefined>(undefined);

  // Init keystore function and resolver
  const initKeystoreResolver = useRef<(success: boolean) => Promise<void>>();
  const initKeystore = useCallback((): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setActiveMode("INIT");
      initKeystoreResolver.current = async (success: boolean): Promise<void> => {
        resolve(success);
        setActiveMode(undefined);
      };
    });
  }, [setActiveMode]);

  // Get keys function and resolver
  const openKeystoreResolver = useRef<(success: boolean) => Promise<void>>();
  const openKeystore = useCallback((): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setActiveMode("OPEN");
      openKeystoreResolver.current = async (success: boolean): Promise<void> => {
        resolve(success);
        setActiveMode(undefined);
      };
    });
  }, [setActiveMode]);

  // const addKeyToKeystore = (newKey: IStoredKey) => {
  //   // Check alias validation
  //   if (!newKey.alias || newKey.alias === "") throw new Error("Alias cannot be empty");

  //   // Check if alias already exists
  //   const aliasExists = keystore?.storedKeys.find((key) => key.alias === newKey.alias);
  //   if (aliasExists) throw new Error(`Key with alias ${newKey.alias} already exists`);

  //   // Check if key already exists
  //   const keyExists = keystore?.storedKeys.find((key) => key.privateKey === newKey.privateKey);
  //   if (keyExists) throw new Error(`That key is already present in your keystore`);

  //   const newKeyToAdd = { ...newKey, id: uuid() };

  //   setKeystore((prev) => ({ ...prev!, storedKeys: [...prev!.storedKeys, newKeyToAdd] }));
  // };

  // const removeKeyFromKeystore = (keyId: string) => {
  //   setKeystore((prev) => ({
  //     ...prev,
  //     storedKeys: prev!.storedKeys!.filter((k) => k.id !== keyId),
  //   }));
  // };

  // const deleteCurrentKeystore = () => {
  //   localStorage.removeItem(LocalStorage.Keystore);
  //   setKeystore(undefined);
  //   setPassword(undefined);
  // };

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

  // const createNewKeystore = (password: string) => {
  //   setPassword(password);
  //   setKeystore({ storedKeys: [] });
  // };

  const initKeystoreHandler = async (): Promise<boolean> => {
    const wasInitialized = await initKeystore();
    return wasInitialized;
  };

  const openKeystoreHandler = async (): Promise<boolean> => {
    const wasOpened = await openKeystore();
    return wasOpened;
  };

  const selectKeyHandler = async (): Promise<IStoredKey | undefined> => {
    // const selectedKey = await selectKey();
    // return selectedKey;
    return undefined;
  };

  return (
    <KeystoreContext.Provider
      value={{
        openKeystore: openKeystoreHandler,
        initKeystore: initKeystoreHandler,
        selectKey: selectKeyHandler,
        keystore,
        setKeystore,
      }}
    >
      {children}
      <KeystoreManager
        mode={activeMode}
        onInitializedKeystore={(keys) => initKeystoreResolver.current?.(keys)}
        onOpenedKeystore={(wasOpened) => openKeystoreResolver.current?.(wasOpened)}
        // onSelectedKey={(key) => selectKeyResolver.current?.(key)}
      />
    </KeystoreContext.Provider>
  );
}

export function useKeystore() {
  return useContext(KeystoreContext);
}
