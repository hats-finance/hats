import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { VaultStatusContext } from "../store";

export const CongratsStatusCard = () => {
  const { t } = useTranslation();

  const { vaultData } = useContext(VaultStatusContext);

  return (
    <div className="status-card">
      <div className="status-card__title">{t("congrats")}</div>
      <p className="status-card__text">
        <strong>{t("yourVaultWasCreated", { vaultName: vaultData.description?.["project-metadata"].name })}</strong>
      </p>
      <p className="status-card__text">{t("followingStepsVaultStatus")}</p>
    </div>
  );
};
