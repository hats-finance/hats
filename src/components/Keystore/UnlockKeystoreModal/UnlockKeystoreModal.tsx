import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeystoreContext } from "../store";
import Modal from "components/Shared/Modal";
import "./index.scss";

export function UnlockKeystoreModal() {
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
    <Modal
      title={t("CommitteeTools.Welcome.unlock-title")}
      setShowModal={() => { }}
      height="fit-content"
      hideClose={true}
    >
      <div className="unlock-vault-modal-wrapper">
        <label className="unlock-vault__label">
          {t("CommitteeTools.Welcome.unlock-vault-description")}
        </label>
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
