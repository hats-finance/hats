import { useEffect, useRef, useState } from "react";

import { LocalStorage } from "../../constants/constants";
import * as encryptor from 'browser-passworder';
import KeysNavbar from "./KeysNavBar";
import { useParams, useRouteMatch } from "react-router-dom";
import NewKey from "./NewKey";
import { IStoredKey } from "../../types/types";
import Decrypt from "./Decrypt";
import './style.scss'
import classNames from "classnames";
import Modal from "../Shared/Modal";

export default function CommitteeTools() {
    const [vault, setVault] = useState<IStoredKey[]>()
    const [showCreateVault, setShowCreateVault] = useState(false)
    const [showUnlockVault, setShowUnlockVault] = useState(false)
    const [password, setPassword] = useState<string>()

    let { path, url } = useRouteMatch();
    let { alias } = useParams<{ alias?: string }>()

    const addKey = (newKey: IStoredKey) => {
        console.log('adding key')
        setVault(prev => [...prev!, newKey])
    }

    // const unlockKey = async (alias: string, passphrase: string) => {
    //     console.log('unlockkey')
    //     const keypair = keystore.find(key => key.alias === alias)
    //     const privateKey = await readPrivateKey({ armoredKey: keypair!.privateKey })
    //     const unlockedKey = await decryptKey({ privateKey, passphrase })
    //     const  setUnlockedKeys((prevState: IUnlockedKey[]) => [...prevState, { alias, privateKey: unlockedKey }])
    //     console.log('unlockkey finish')

    // }

    const committeeToolsWrapper = classNames({
        'committee-tools-wrapper': true,
        'content': true
    })

    useEffect(() => {
        const pgpKeystore = localStorage.getItem(LocalStorage.PGPKeystore)

        // vault must be created
        if (!pgpKeystore) {
            console.log("show create")
            setShowCreateVault(true)
        } else {
            console.log("show unlock")
            setShowUnlockVault(true)
        }

    }, [])

    useEffect(() => {
        console.log('vault updated');
        (async () => {
            if (password && vault) {
                const encrypted = await encryptor.encrypt(password, vault)
                localStorage.setItem(LocalStorage.PGPKeystore, encrypted)
                console.log('updated local storage', vault);
            }
        })()
    }, [vault])

    const createVault = (password: string) => {
        setPassword(password)
        setVault([])
        setShowCreateVault(false)
    }

    const unlockVault = async (password: string) => {
        const decrypted = await encryptor.decrypt(password, localStorage.getItem(LocalStorage.PGPKeystore))
        setVault(decrypted)
        setShowUnlockVault(false)
    }

    const Content = () => {
        if (vault) {
            if (alias) {
                const key = vault.find(key => key.alias === alias)
                if (key) {
                    return <div>
                        <Decrypt storedKey={key} />
                    </div>
                } else {
                    return <div>{alias} not found</div>
                }
            } else {
                return <NewKey addKey={addKey} />
            }
        }
        return <></>
    }
    return <div className={committeeToolsWrapper}>
        <KeysNavbar keys={vault!} />
        {showCreateVault && <CreateVaultModal onCreateVault={createVault} setShowModal={setShowCreateVault} />}
        {showUnlockVault && <UnlockVaultModal onUnlockVault={unlockVault} setShowModal={setShowUnlockVault} />}
        <Content />

    </div >
}



function CreateVaultModal({ onCreateVault, setShowModal }:
    {
        onCreateVault: (password: string) => any,
        setShowModal: (show: boolean) => any
    }) {
    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string>()

    const createVault = () => {
        if (passwordRef.current!.value != passwordConfirmRef.current!.value) {
            setError("Passwords mismatch")
            return
        }
        onCreateVault(passwordRef.current!.value)
    }

    return (
        <div>
            <Modal title="Create Vault" setShowModal={setShowModal} >
                <p>Enter password</p>
                <input type="password" ref={passwordRef} />
                <p>Confirm</p>
                <input type="password" ref={passwordConfirmRef} />
                <button onClick={createVault}></button>
                {error && <div>{error}</div>}
            </Modal >
        </div >)
}


function UnlockVaultModal({ onUnlockVault, setShowModal }:
    {
        onUnlockVault: (password: string) => any,
        setShowModal: (show: boolean) => any
    }) {
    const passwordRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string>()

    const unlockVault = async () => {
        try {
            await onUnlockVault(passwordRef.current!.value)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        }
    }

    return (
        <div>
            <Modal title="Unlock Vault" setShowModal={setShowModal} >
                <p>Enter password</p>
                <input type="password" ref={passwordRef} />
                <button onClick={unlockVault}></button>
                {error && <div>{error}</div>}
            </Modal >
        </div >)
}