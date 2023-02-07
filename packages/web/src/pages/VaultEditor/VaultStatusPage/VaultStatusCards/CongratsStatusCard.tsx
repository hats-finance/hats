import { useTranslation } from "react-i18next";

export const CongratsStatusCard = () => {
  const { t } = useTranslation();

  return (
    <div className="status-card">
      <div className="status-card__title">{t("congrats")}</div>
      <p className="status-card__text">
        <strong>{t("yourVaultWasCreated")}</strong>
      </p>
      <p className="status-card__text">{t("followingStepsVaultStatus")}</p>
    </div>
  );
};
