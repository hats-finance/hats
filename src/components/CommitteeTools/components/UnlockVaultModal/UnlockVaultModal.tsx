import { useContext, useState } from "react";
import Modal from "components/Shared/Modal";
import { VaultContext } from "../../store";
import { t } from "i18next";
import "./index.scss";

export default function UnlockVaultModal({ setShowModal }: { setShowModal: (show: boolean) => any; }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const vaultContext = useContext(VaultContext);

  const unlockVault = async () => {
    try {
      await vaultContext.unlockVault(password);
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
        <button disabled={!password} onClick={unlockVault}>
          {t("CommitteeTools.Welcome.unlock")}
        </button>
      </div>
    </Modal>
  );
}
