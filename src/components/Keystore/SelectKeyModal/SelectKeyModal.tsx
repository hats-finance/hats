import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "components";
import { IStoredKey } from "../types";
import { KeystoreContext } from "../store";
import GenerateKey from "./GenerateKey/GenerateKey";
import ImportKey from "./ImportKey/ImportKey";
import GenerateKeypairIcon from "assets/icons/create-keypair.svg";
import ImportKeyapirIcon from "assets/icons/import-keypair.svg";
import { ExistentKeyCard } from "./ExistentKeyCard/ExistentKeyCard";
import "./index.scss";

enum ActionType {
  Generate,
  Import,
  None,
}
interface IAction {
  type: ActionType;
  key?: IStoredKey;
}

type SelectKeyModalProps = {
  isShowing: boolean;
  onHide: () => void;
};

export function SelectKeyModal({ isShowing, onHide }: SelectKeyModalProps) {
  const { t } = useTranslation();
  const [action, setAction] = useState<IAction>({ type: ActionType.None });
  const keystoreContext = useContext(KeystoreContext);
  const vault = keystoreContext.keystore;

  const handleOnFinish = () => {
    onHide();
    setAction({ type: ActionType.None });
  };

  // Going back to the main view
  const handleOnBackButton = (): (() => void) | undefined => {
    if (action.type !== ActionType.None) {
      return () => setAction({ type: ActionType.None });
    }

    return undefined;
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
      <p className="keymodal-main__intro">{t("CommitteeTools.keymodal.intro-text")}</p>
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
      {vault?.storedKeys.length !== 0 && (
        <>
          <p className="keymodal-main__list-title">{t("CommitteeTools.keymodal.your-keys")}</p>
          <div className="keymodal-main__keypair-list">
            {vault?.storedKeys.map((key) => (
              <ExistentKeyCard key={key.alias} keypair={key} onSelect={onHide} />
            ))}
          </div>
        </>
      )}
    </>
  );

  const byAction = (action: IAction) => {
    switch (action.type) {
      case ActionType.Generate:
        return <GenerateKey onFinish={handleOnFinish} />;
      case ActionType.Import:
        return <ImportKey onFinish={handleOnFinish} />;
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
      case ActionType.None:
        if (vault?.storedKeys.length !== 0) return t("CommitteeTools.keymodal.list-keypair");
        else return t("CommitteeTools.keymodal.title");
    }
  };

  return (
    <Modal isShowing={isShowing} title={titleByAction()} onHide={handleOnFinish} onBackButton={handleOnBackButton()} withTitleDivider>
      <div className="select-key-modal-wrapper">{byAction(action)}</div>
    </Modal>
  );
}

export default SelectKeyModal;
