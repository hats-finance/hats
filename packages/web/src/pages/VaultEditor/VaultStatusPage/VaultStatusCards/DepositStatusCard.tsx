import { useTranslation } from "react-i18next";
import { Button, Pill } from "components";

export const DepositStatusCard = () => {
  const { t } = useTranslation();

  const isVaultDeposited = false;

  return (
    <div className="status-card">
      <div className="status-card__title">
        <span>{t("deposit")}</span>
        <Pill color={isVaultDeposited ? "blue" : "red"} text={isVaultDeposited ? t("completed") : t("awaitingAction")} />
      </div>

      {isVaultDeposited ? (
        <p className="status-card__text">Assets deposited:</p>
      ) : (
        <>
          <p className="status-card__text">{t("depositOnVaultExplanation")}</p>
          <Button className="status-card__button">{t("deposit")}</Button>
        </>
      )}
    </div>
  );
};
