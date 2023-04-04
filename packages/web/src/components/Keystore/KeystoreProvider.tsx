import { useContext, useState, createContext, useRef, useCallback } from "react";
import { LocalStorage } from "constants/constants";
import { KeystoreManager } from "./KeystoreManager";
import { IKeystoreContext, IKeystoreActions, IKeystoreData } from "./types";

const KeystoreContext = createContext<IKeystoreContext>(undefined as any);

export function KeystoreProvider({ children }) {
  const [activeMode, setActiveMode] = useState<IKeystoreActions | undefined>();
  const [keystore, setKeystore] = useState<IKeystoreData | undefined>(undefined);
  const [isKeystoreLoaded, setIsKeystoreLoaded] = useState(false);
  const [isKeystoreCreated, setIsKeystoreCreated] = useState(!!localStorage.getItem(LocalStorage.Keystore));

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

  // Open keystore function and resolver
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

  // Select key from keystore function and resolver
  const selectPublicKeyResolver = useRef<(key: string | undefined) => Promise<void>>();
  const selectPublicKey = useCallback((): Promise<string | undefined> => {
    return new Promise<string | undefined>((resolve) => {
      setActiveMode("SELECT_PUBLICKEY");
      selectPublicKeyResolver.current = async (publickey: string | undefined): Promise<void> => {
        resolve(publickey);
        setActiveMode(undefined);
      };
    });
  }, [setActiveMode]);

  const initKeystoreHandler = useCallback(async (): Promise<boolean> => {
    const wasInitialized = await initKeystore();
    return wasInitialized;
  }, [initKeystore]);

  const openKeystoreHandler = useCallback(async (): Promise<boolean> => {
    const wasOpened = await openKeystore();
    return wasOpened;
  }, [openKeystore]);

  const selectPublicKeyHandler = useCallback(async (): Promise<string | undefined> => {
    const selectedPublicKey = await selectPublicKey();
    return selectedPublicKey;
  }, [selectPublicKey]);

  return (
    <KeystoreContext.Provider
      value={{
        openKeystore: openKeystoreHandler,
        initKeystore: initKeystoreHandler,
        selectPublicKey: selectPublicKeyHandler,
        keystore,
        setKeystore,
        isKeystoreLoaded,
        isKeystoreCreated,
      }}
    >
      {children}
      <KeystoreManager
        mode={activeMode}
        setIsKeystoreLoaded={setIsKeystoreLoaded}
        setIsKeystoreCreated={setIsKeystoreCreated}
        onInitializedKeystore={(keys) => initKeystoreResolver.current?.(keys)}
        onOpenedKeystore={(wasOpened) => openKeystoreResolver.current?.(wasOpened)}
        onSelectedPublicKey={(publickey) => selectPublicKeyResolver.current?.(publickey)}
      />
    </KeystoreContext.Provider>
  );
}

export function useKeystore() {
  return useContext(KeystoreContext);
}
