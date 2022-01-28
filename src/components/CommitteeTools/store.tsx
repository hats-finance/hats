import { IStoredKey } from "../../types/types";
import React, { useEffect, useState } from 'react'
import * as encryptor from 'browser-passworder';
import { LocalStorage } from "../../constants/constants";

interface IVaultStore {
    storedKeys: IStoredKey[]
    selectedAlias?: string | undefined
}

interface IVaultContext {
    vault: IVaultStore | undefined
    isLocked?: boolean
    isCreated?: boolean
    selectedKey?: IStoredKey | undefined
    addKey?: (key: IStoredKey) => void
    removeKey?: (key: IStoredKey) => void
    createVault?: (password: string) => void
    unlockVault?: (password: string) => void
    setSelectedAlias?: (alias: string) => void
}

export const VaultContext = React.createContext<IVaultContext>({
    vault: undefined,
})

export function VaultProvider({ children }) {
    const [vault, setVault] = useState<IVaultStore | undefined>(undefined);
    const selectedKey = vault?.selectedAlias ? vault.storedKeys.find(key => key.alias === vault.selectedAlias) : undefined;
    const [password, setPassword] = useState<string>();

    const addKey = (newKey: IStoredKey) => {
        setVault(prev => ({ ...prev!, storedKeys: [...prev!.storedKeys, newKey] }))
    };

    const removeKey = (key: IStoredKey) => {
        setVault(prev => ({
            ...prev,
            storedKeys: prev!.storedKeys!.filter(k => k.alias !== key.alias)
        }))
    }

    const createVault = (password: string) => {
        setPassword(password);
        setVault({ storedKeys: [] });
    };

    const setSelectedAlias = (alias: string) =>
        setVault(prev => ({ ...prev!, selectedAlias: alias }))


    const unlockVault = async (password: string) => {
        // this will throw an exception if fails so user gets error message in dialog
        const decrypted = await encryptor.decrypt(password, localStorage.getItem(LocalStorage.PGPKeystore))
        setPassword(password);
        setVault(decrypted);
    };

    useEffect(() => {
        (async () => {
            if (password && vault) {
                const encrypted = await encryptor.encrypt(password, vault);
                localStorage.setItem(LocalStorage.PGPKeystore, encrypted);
            }
        })()
    }, [vault, password])

    return <VaultContext.Provider value={{
        vault, addKey, removeKey, createVault, unlockVault, setSelectedAlias,
        selectedKey,
        isLocked: password === undefined,
        isCreated: localStorage.getItem(LocalStorage.PGPKeystore) !== null
    }}>
        {children}
    </VaultContext.Provider>

}