import { NavLink } from "react-router-dom";
import { t } from "i18next";
import classNames from "classnames";
import { IStoredKey } from "types/types";
import { useContext, useState } from "react";
import Modal from "components/Shared/Modal";
import { VaultContext } from "../../store";
import KeyDetails from "./KeyDetails";
import GenerateKey from "./GenerateKey";
import ImportKey from "./ImportKey";
import DeleteKey from "./DeleteKey";
import GenerateKeypairIcon from "assets/icons/create-keypair.svg";
import ImportKeyapirIcon from "assets/icons/import-keypair.svg";
import DeleteIcon from "assets/icons/delete.icon.svg";
import CopyIcon from "assets/icons/copy.icon.svg";
import "./index.scss";

enum ActionType {
  Generate,
  Import,
  Delete,
  Display,
  None
}
interface IAction {
  type: ActionType;
  key?: IStoredKey;
}

export function SelectKeyModal({
  setShowModal,
  showKey
}: {
  showKey?: IStoredKey; // used to show key details
  setShowModal: (show: boolean) => any;
}) {
  console.log({ showKey });
  const vaultContext = useContext(VaultContext);
  const [action, setAction] = useState<IAction>(
    showKey
      ? { type: ActionType.Display, key: showKey }
      : { type: ActionType.None }
  );
  const vault = vaultContext.vault!;

  const onFinish = () => {
    if (
      action.type === ActionType.Generate ||
      action.type === ActionType.Import
    ) {
      setShowModal(false);
    }
    setAction({ type: ActionType.None });
  };

  const SpecialButton = ({ src, title, text, ...props }) => (
    <button {...props}>
      <img src={src} alt={title} />
      <title>{title}</title>
      <p>{text}</p>
    </button>
  );

  const mainView = () => (
    <>
      <p className="keymodal-main__intro">
        {t("CommitteeTools.keymodal.intro-text")}
      </p>
      <div className="keymodal-main__special-container">
        <SpecialButton
          src={GenerateKeypairIcon}
          title={t("CommitteeTools.keymodal.create-keypair")}
          text={t("CommitteeTools.keymodal.create-text")}
          onClick={() => setAction({ type: ActionType.Generate })}
        />
        <SpecialButton
          src={ImportKeyapirIcon}
          title={t("CommitteeTools.keymodal.import-keypair")}
          text={t("CommitteeTools.keymodal.import-text")}
          onClick={() => setAction({ type: ActionType.Import })}
        />
      </div>
      {vault.storedKeys.length !== 0 && (
        <>
          <p className="keymodal-main__list-title">
            {t("CommitteeTools.keymodal.your-keys")}
          </p>
          <div className="keymodal-main__keypair-list">
            {vault.storedKeys.map((key) => keyRow(key))}
          </div>
        </>
      )}
    </>
  );

  const keyRow = (key: IStoredKey) => {
    const selected = key.alias === vaultContext.selectedKey?.alias;
    return (
      <li key={key.alias}>
        <div className={classNames({ "fish-eye": true, selected })} />
        <NavLink
          to="#"
          className="title"
          onClick={() => {
            vaultContext?.setSelectedAlias!(key.alias);
            setShowModal(false);
          }}
        >
          {key.alias}
        </NavLink>
        <NavLink
          to="#"
          className="copy"
          onClick={() => {
            setAction({ type: ActionType.Display, key: key });
          }}
        >
          <img src={CopyIcon} alt="display" />
        </NavLink>
        <NavLink
          to="#"
          className="delete"
          onClick={() => {
            setAction({ type: ActionType.Delete, key: key });
          }}
        >
          <img src={DeleteIcon} alt="delete" />
        </NavLink>
      </li>
    );
  };

  const byAction = (action: IAction) => {
    switch (action.type) {
      case ActionType.Generate:
        return <GenerateKey onFinish={onFinish} />;
      case ActionType.Import:
        return <ImportKey onFinish={onFinish} />;
      case ActionType.Delete:
        return <DeleteKey keyToDelete={action.key!} onFinish={onFinish} />;
      case ActionType.Display:
        return <KeyDetails storedKey={action.key!} onFinish={onFinish} />;
      case ActionType.None:
        return mainView();
    }
  };

  const titleByAction = () => {
    switch (action.type) {
      case ActionType.Generate:
        return t("CommitteeTools.keymodal.create-keypair");
      case ActionType.Import:
        return t("CommitteeTools.keymodal.import-keypair");
      case ActionType.Delete:
        return t("CommitteeTools.keymodal.delete-keypair");
      case ActionType.Display:
        return t("CommitteeTools.KeyDetails.title");
      case ActionType.None:
        return t("CommitteeTools.keymodal.title");
    }
  };

  return (
    <Modal
      title={titleByAction()}
      height="fit-content"
      width="fit-content"
      setShowModal={setShowModal}
    >
      {byAction(action)}
    </Modal>
  );
}

export default SelectKeyModal;
