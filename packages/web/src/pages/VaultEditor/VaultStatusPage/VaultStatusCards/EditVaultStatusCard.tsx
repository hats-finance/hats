import { useTranslation } from "react-i18next";
import { Button, Pill } from "components";

export const EditVaultStatusCard = () => {
  const { t } = useTranslation();

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <span>{t("setup")}</span>
          <Pill color="blue" text={t("completed")} />
        </div>
      </div>
      <p className="status-card__text">{t("setupCompleted")}</p>
      <p className="status-card__text">{t("editVaultHelp")}</p>

      <Button className="status-card__button">{t("editVault")}</Button>
    </div>
  );
};
