import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { VaultContext } from "../../store";
import CreateVaultModal from "../CreateVaultModal/CreateVaultModal";
import "./index.scss";

const Welcome = () => {
  const { t } = useTranslation();
  const vaultContext = useContext(VaultContext);
  const [showCreateVault, setShowCreateVault] = useState(false);

  return (
    <div className="committee-welcome">
      <h1 className="committee-welcome__title">
        {t("CommitteeTools.Welcome.title")}
      </h1>
      <p className="committee-welcome__content-1">
        {t("CommitteeTools.Welcome.content-1")}
      </p>
      <p className="committee-welcome__content-2">
        {t("CommitteeTools.Welcome.content-2")}
      </p>
      <p className="committee-welcome__step-title">
        {t("CommitteeTools.Welcome.step-1")}
      </p>
      <p className="committee-welcome__step-content">
        {t("CommitteeTools.Welcome.step-1-content")}
      </p>
      <p className="committee-welcome__step-title">
        {t("CommitteeTools.Welcome.step-2")}
      </p>
      <p className="committee-welcome__step-content">
        {t("CommitteeTools.Welcome.step-2-content")}
      </p>
      <p className="committee-welcome__step-title">
        {t("CommitteeTools.Welcome.step-3")}
      </p>
      <p className="committee-welcome__step-content">
        {t("CommitteeTools.Welcome.step-3-content")}
      </p>
      <div className="committee-welcome__button-container">
        {vaultContext.isCreated ? (
          <button
            onClick={() => {
              if (
                prompt(t("CommitteeTools.Welcome.delete-confirmation")) ===
                t("CommitteeTools.Welcome.delete-yes")
              ) {
                vaultContext.deleteVault();
              }
            }}
          >
            {t("CommitteeTools.Welcome.delete-vault")}
          </button>
        ) : (
          <button onClick={() => setShowCreateVault(true)}>
            {t("CommitteeTools.create-vault")}
          </button>
        )}
      </div>
      {showCreateVault && (
        <CreateVaultModal setShowModal={setShowCreateVault} />
      )}
    </div>
  );
};

export default Welcome;
