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
        {vaultData.description ? (
          <strong>
            {t("yourVaultWasCreatedWithVaultName", { vaultName: vaultData.description?.["project-metadata"].name })}
          </strong>
        ) : (
          <strong>{t("yourVaultWasCreated")}</strong>
        )}
      </p>
      <p className="status-card__text">{t("followingStepsVaultStatus")}</p>
    </div>
  );
};
