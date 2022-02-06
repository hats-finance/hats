import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "components/Shared/Modal";
import { VaultContext } from "../../store";
import "./index.scss";

export default function UnlockVaultModal() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const { t } = useTranslation();
  const vaultContext = useContext(VaultContext);

  const unlockVault = async () => {
    try {
      await vaultContext.unlockVault!(passwordRef.current!.value);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <Modal
      title={t("CommitteeTools.Welcome.unlock-title")}
      setShowModal={() => {}}
      height="fit-content"
      hideClose={true}
    >
      <label className="unlock-vault__label">
        {t("CommitteeTools.Welcome.unlock-vault-description")}
      </label>
      <label className="unlock-vault__label">
        {t("CommitteeTools.Welcome.password")}
      </label>
      <input
        className="unlock-vault__input"
        type="password"
        ref={passwordRef}
        placeholder={t("CommitteeTools.Welcome.enter-password-placeholder")}
      />
      <button onClick={unlockVault}>Unlock</button>
      {error && <div>{error}</div>}
    </Modal>
  );
}
