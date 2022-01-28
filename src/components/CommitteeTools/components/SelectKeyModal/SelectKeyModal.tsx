import { IStoredKey } from "../../../../types/types"
import { useContext, useState } from "react"
import Modal from "../../../Shared/Modal"
import { VaultContext } from "../../store"
import KeyDetails from "./KeyDetails"
import GenerateKey from "./GenerateKey"
import ImportKey from "./ImportKey"
import DeleteKey from "./DeleteKey"
import { NavLink } from "react-router-dom"


const SelectKeyModal = ({ setShowModal }
    : { onSelectKey: () => any, setShowModal: (show: boolean) => any }) => {
    const [showImport, setShowImport] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const vaultContext = useContext(VaultContext)
    const [showDisplayKey, setShowDisplayKey] = useState<IStoredKey>()
    const [showDeleteKey, setShowDeleteKey] = useState<IStoredKey>()
    const vault = vaultContext.vault!

    const onKeyAdded = () => {
        setShowCreate(false)
        setShowImport(false)
    }

    const deleteCompleted = () => {
        setShowDeleteKey(undefined)
    }

    return <Modal title="keys" height="fit-content" width="fit-content" setShowModal={setShowModal}>
        {(showCreate || showImport || showDisplayKey || showDeleteKey) ? <>
            {showCreate && <GenerateKey onAdded={onKeyAdded} />}
            {showImport && <ImportKey onAdded={onKeyAdded} />}
            {showDisplayKey && <KeyDetails storedKey={showDisplayKey} onBack={() => setShowDisplayKey(undefined)} />}
            {showDeleteKey && <DeleteKey keyToDelete={showDeleteKey} onCompleted={deleteCompleted} />}
        </> : <>
            <button onClick={() => setShowCreate(true)}>create keypair</button>
            <button onClick={() => setShowImport(true)}>import keypair</button>


            {vault.storedKeys &&
                <div className="keypair-list">
                    {vault.storedKeys.map(key =>
                        <li key={key.alias}>
                            <NavLink className="keypair-name" to="#" onClick={() => {
                                vaultContext?.setSelectedAlias!(key.alias)
                                setShowModal(false)
                            }} >{key.alias}{key.alias === vaultContext.selectedKey?.alias && "(Selected)"}</NavLink>
                            <div>
                                <NavLink to="#" onClick={() => {
                                    setShowDisplayKey(key)
                                }}>show</NavLink>
                                <NavLink to="#" onClick={() => {
                                    setShowDeleteKey(key)
                                }}>delete</NavLink>
                            </div>
                        </li>)}
                </div>}
        </>
        }
    </Modal >
}

export default SelectKeyModal