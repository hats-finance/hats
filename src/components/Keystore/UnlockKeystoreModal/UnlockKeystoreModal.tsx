import { Modal } from "components/Modal/Modal";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeystoreContext } from "../store";
import "./index.scss";

type UnlockKeystoreModalProps = {
  isShowing: boolean;
  onHide?: () => void;
};

export function UnlockKeystoreModal({ isShowing, onHide }: UnlockKeystoreModalProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const keystoreContext = useContext(KeystoreContext);

  const unlockKeystore = async () => {
    try {
      await keystoreContext.unlockKeystore(password);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <Modal isShowing={isShowing} title={t("CommitteeTools.Welcome.unlock-title")} onHide={onHide} withTitleDivider disableClose>
      <div className="unlock-vault-modal-wrapper">
        <label className="unlock-vault__label">{t("CommitteeTools.Welcome.unlock-vault-description")}</label>
        <input
          className="unlock-vault__input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("CommitteeTools.Welcome.enter-password-placeholder")}
        />
        {error && <div className="error-label">{error}</div>}
        <button disabled={!password} onClick={unlockKeystore}>
          {t("CommitteeTools.Welcome.unlock")}
        </button>
      </div>
    </Modal>
  );
}
