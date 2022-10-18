import { IStoredKey, IKeystoreContext, IKeystoreData } from "./types";
import React, { useEffect, useState } from 'react'
import * as encryptor from 'browser-passworder';
import { LocalStorage } from "../../constants/constants";

export const KeystoreContext = React.createContext<IKeystoreContext>(undefined as any);

export function KeystoreProvider({ children }) {
    const [keystore, setKeystore] = useState<IKeystoreData | undefined>(undefined);
    const selectedKey = keystore?.selectedAlias ? keystore.storedKeys.find(key => key.alias === keystore.selectedAlias) : undefined;
    const [password, setPassword] = useState<string>();
    const [isCreated, setIsCreated] = useState<boolean>(false);

    const addKey = (newKey: IStoredKey) => {
        // check for empty alias
        if (!newKey.alias || newKey.alias === "") {
            throw new Error('Alias cannot be empty')
        }

        // first check if alias already exists
        if (keystore?.storedKeys.find(key => key.alias === newKey.alias)) {
            throw new Error(`Key with alias ${newKey.alias} already exists`)
        }

        // check that key does not already exist
        if (keystore?.storedKeys.find(key => key.privateKey === newKey.privateKey)) {
            throw new Error(`Key is already present in your keystore`)
        }

        setKeystore(prev => ({ ...prev!, storedKeys: [...prev!.storedKeys, newKey] }))
    }

    const removeKey = (key: IStoredKey) => {
        setKeystore(prev => ({
            ...prev,
            storedKeys: prev!.storedKeys!.filter(k => k.alias !== key.alias)
        }))
    }

    const createVault = (password: string) => {
        setPassword(password);
        setKeystore({ storedKeys: [] });
    };

    const setSelectedAlias = (alias: string) =>
        setKeystore(prev => ({ ...prev!, selectedAlias: alias }))


    const unlockVault = async (password: string) => {
        // this will throw an exception if fails so user gets error message in dialog
        const decrypted = await encryptor.decrypt(password, localStorage.getItem(LocalStorage.Keystore))
        setPassword(password);
        setKeystore(decrypted);
    };

    const deleteVault = () => {
        localStorage.removeItem(LocalStorage.Keystore);
        setKeystore(undefined);
    }

    const deleteKey = ({ alias }: IStoredKey) => {
        setKeystore(prev => {
            const withoutDeleted = prev!.storedKeys.filter(key => key.alias !== alias)
            return {
                ...prev,
                selectedAlias: withoutDeleted.filter(key => key.alias === prev!.selectedAlias).length > 0 ? prev!.selectedAlias : undefined,
                storedKeys: withoutDeleted
            }
        })
    }

    useEffect(() => {
        (async () => {
            if (password && keystore) {
                const encrypted = await encryptor.encrypt(password, keystore);
                localStorage.setItem(LocalStorage.Keystore, encrypted);
                setIsCreated(true);
            }
        })()
    }, [keystore, password])

    useEffect(() => {
        if (localStorage.getItem(LocalStorage.Keystore)) setIsCreated(true);
    }, []);

    return <KeystoreContext.Provider value={{
        keystore, addKey, removeKey, createKeystore: createVault, unlockKeystore: unlockVault, setSelectedAlias,
        selectedKey, deleteKeystore: deleteVault, deleteKey,
        isLocked: password === undefined,
        isCreated,
    }}>
        {children}
    </KeystoreContext.Provider>

}