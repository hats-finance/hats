import { IStoredKey } from "../../../../types/types"
import { useContext, useState } from "react"
import Modal from "../../../Shared/Modal"
import { VaultContext } from "../../store"
import NewKey from "../NewKey/NewKey"
import ImportKey from "../NewKey/ImportKey"
import KeyDetails from "./KeyDetails"


const SelectKeyModal = ({ onSelectKey, setShowModal }
    : { onSelectKey: () => any, setShowModal: (show: boolean) => any }) => {
    const [showImport, setShowImport] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const vaultContext = useContext(VaultContext)
    const selectedAlias = useState(null)
    const [showKey, setShowKey] = useState<IStoredKey>()
    console.log('vault', vaultContext)
    const vault = vaultContext.vault!

    const onAdded = (added: IStoredKey) => {

    }


    return <Modal title="keys" height="fit-content" setShowModal={setShowModal}>
        {(showCreate || showImport || showKey) ? <>
            {showCreate && <NewKey onAdded={onAdded} />}
            {showImport && <ImportKey onAdded={onAdded} />}
            {showKey && <KeyDetails storedKey={showKey} />}
        </> :
            <>
                <button onClick={() => setShowCreate(true)}>create keypair</button>
                <button onClick={() => setShowImport(true)}>import keypair</button>
                <ul>
                    {vault.storedKeys &&
                        vault.storedKeys.map(key =>
                            <li key={key.alias}>
                                <div>
                                    {key.alias}
                                    <a onClick={() => {
                                        setShowKey(key)
                                    }}>show</a>
                                    <a href="#" onClick={() => {
                                        vaultContext?.setSelectedAlias!(key.alias)
                                        onSelectKey()
                                    }}>select</a>
                                </div>
                            </li>)}

                </ul>
            </>
        }
    </Modal >
}

export default SelectKeyModal