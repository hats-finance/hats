import { IStoredKey } from "../../../../types/types"
import { useContext, useState } from "react"
import Modal from "../../../Shared/Modal"
import { VaultContext } from "../../store"
import KeyDetails from "./KeyDetails"
import GenerateKey from "./GenerateKey"
import ImportKey from "./ImportKey"


const SelectKeyModal = ({ setShowModal }
    : { onSelectKey: () => any, setShowModal: (show: boolean) => any }) => {
    const [showImport, setShowImport] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const vaultContext = useContext(VaultContext)
    const [showKey, setShowKey] = useState<IStoredKey>()
    const vault = vaultContext.vault!

    const onKeyAdded = (key: IStoredKey) => {
        setShowModal(false)
    }

    return <Modal title="keys" height="fit-content" width="fit-content" setShowModal={setShowModal}>
        {(showCreate || showImport || showKey) ? <>
            {showCreate && <GenerateKey onAdded={onKeyAdded} />}
            {showImport && <ImportKey onAdded={onKeyAdded} />}
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
                                        setShowModal(false)
                                    }}>select</a>
                                </div>
                            </li>)}

                </ul>
            </>
        }
    </Modal >
}

export default SelectKeyModal