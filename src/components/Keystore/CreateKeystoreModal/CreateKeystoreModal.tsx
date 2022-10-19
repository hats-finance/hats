import { HatsModal } from "components/HatsModal/HatsModal";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeystoreContext } from "../store";
import "./index.scss";

type CreateKeystoreModalProps = {
  isShowing: boolean;
  onHide?: () => void;
};

export function CreateKeystoreModal({ isShowing, onHide = () => {} }: CreateKeystoreModalProps) {
  const [password, setPasswordRef] = useState("");
  const [passwordConfirm, setPasswordConfirmRef] = useState("");
  const [error, setError] = useState<string>();
  const keystoreContext = useContext(KeystoreContext);
  const { t } = useTranslation();

  const createKeystore = () => {
    if (password !== passwordConfirm) {
      setError(t("CommitteeTools.Welcome.passwords-mismatch"));
      return;
    }
    keystoreContext.createKeystore(password);
  };

  return (
    <HatsModal
      isShowing={isShowing}
      title={t("CommitteeTools.Welcome.create-title")}
      onHide={onHide}
      withTitleDivider>
      <div className="create-vault-modal-wrapper">
        <p className="create-vault__description">{t("CommitteeTools.Welcome.create-description")}</p>
        <p className="create-vault__addenum">{t("CommitteeTools.Welcome.create-addenum")}</p>
        <p>{t("CommitteeTools.Welcome.password")}</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPasswordRef(e.target.value)}
          placeholder={t("CommitteeTools.Welcome.create-password-placeholder")}
        />
        <p>{t("CommitteeTools.Welcome.confirm")}</p>
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirmRef(e.target.value)}
          placeholder={t("CommitteeTools.Welcome.create-retype-placeholder")}
        />
        {error && <div className="error-label">{error}</div>}
        <button disabled={!password || !passwordConfirm} onClick={createKeystore}>
          {t("CommitteeTools.create-vault")}
        </button>
      </div>
    </HatsModal>
  );
}
