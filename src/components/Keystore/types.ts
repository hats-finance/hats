export interface IStoredKey {
    alias: string
    privateKey: string
    passphrase?: string | undefined
    publicKey: string
}

export interface IKeystoreData {
    storedKeys: IStoredKey[]
    selectedAlias?: string | undefined
}

export interface IKeystoreContext {
    keystore: IKeystoreData | undefined
    isLocked: boolean
    isCreated: boolean
    selectedKey: IStoredKey | undefined
    addKey: (key: IStoredKey) => void
    removeKey: (key: IStoredKey) => void
    createKeystore: (password: string) => void
    unlockKeystore: (password: string) => void
    setSelectedAlias: (alias: string) => void
    deleteKeystore: () => void
    deleteKey: (key: IStoredKey) => void
}
