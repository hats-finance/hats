import { IStoredKey } from "../../../../types/types"
import { useContext, useState } from "react"
import Modal from "../../../Shared/Modal"
import { VaultContext } from "../../store"
import KeyDetails from "./KeyDetails"
import GenerateKey from "./GenerateKey"
import ImportKey from "./ImportKey"
import DeleteKey from "./DeleteKey"
import { NavLink } from "react-router-dom"
import { t } from "i18next"
import GenerateKeypairIcon from "../../../../assets/icons/create-keypair.svg"
import ImportKeyapirIcon from "../../../../assets/icons/import-keypair.svg"

enum ActionType {
    Generate,
    Import,
    Delete,
    Display,
    None
}
interface IAction {
    type: ActionType
    key?: IStoredKey
}

export function SelectKeyModal({ setShowModal }:
    { onSelectKey: () => any, setShowModal: (show: boolean) => any }) {
    const vaultContext = useContext(VaultContext)
    const [action, setAction] = useState<IAction>({ type: ActionType.None })
    const vault = vaultContext.vault!

    const onFinish = () => {
        setAction({ type: ActionType.None })
    }

    const SpecialButton = ({ src, title, text, ...props }) =>
        <button {...props}>
            <img src={src} alt={title} />
            <title>{title}</title>
            <p>{text}</p>
        </button>


    const mainView = () => (
        <>
            <p>{t("CommitteeTools.keymodal.intro-text")}</p>
            <div className="special-container">
                <SpecialButton
                    src={GenerateKeypairIcon}
                    title={t("CommitteeTools.keymodal.create-keypair")}
                    text={t("CommitteeTools.keymodal.create-text")}
                    onClick={() => setAction({ type: ActionType.Generate })} />
                <SpecialButton
                    src={ImportKeyapirIcon}
                    title={t("CommitteeTools.keymodal.import-keypair")}
                    text={t("CommitteeTools.keymodal.import-text")}
                    onClick={() => setAction({ type: ActionType.Import })} />
            </div>
            {vault.storedKeys.length !== 0 &&
                <div className="keypair-list">
                    {vault.storedKeys.map(key => keyRow(key))}
                </div>}
        </>)

    const keyRow = (key: IStoredKey) => {
        const selected = key.alias === vaultContext.selectedKey?.alias
        return <li className={selected ? "selected" : ""} key={key.alias}>
            <NavLink to="#" onClick={() => {
                vaultContext?.setSelectedAlias!(key.alias)
                setShowModal(false)
            }}>{key.alias}{selected && " " +
                t("CommitteeTools.keymodal.selected")}</NavLink>
            <div className="actions">
                <NavLink to="#" onClick={() => {
                    setAction({ type: ActionType.Display, key: key })
                }}>show</NavLink>
                <NavLink to="#" onClick={() => {
                    setAction({ type: ActionType.Delete, key: key })
                }}>delete</NavLink>
            </div>
        </li>
    }

    const byAction = (action: IAction) => {
        switch (action.type) {
            case ActionType.Generate:
                return <GenerateKey onFinish={onFinish} />
            case ActionType.Import:
                return <ImportKey onFinish={onFinish} />
            case ActionType.Delete:
                return <DeleteKey keyToDelete={action.key!} onFinish={onFinish} />
            case ActionType.Display:
                return <KeyDetails storedKey={action.key!} onFinish={onFinish} />
            case ActionType.None:
                return mainView()
        }
    }

    const titleByAction = () => {
        switch (action.type) {
            case ActionType.Generate:
                return t("CommitteeTools.keymodal.create-keypair")
            case ActionType.Import:
                return t("CommitteeTools.keymodal.import-keypair")
            case ActionType.Delete:
                return t("CommitteeTools.keymodal.delete-keypair")
            case ActionType.Display:
                return t("CommitteeTools.KeyDetails.title")
            case ActionType.None:
                return t("CommitteeTools.keymodal.title")
        }
    }

    return <Modal
        title={titleByAction()}
        height="fit-content" width="fit-content"
        setShowModal={setShowModal} >
        {byAction(action)}
    </Modal >

}

export default SelectKeyModal