import { useTranslation } from "react-i18next";
import { Button, Pill } from "components";

export const CheckInStatusCard = () => {
  const { t } = useTranslation();

  const isCommitteeCheckedIn = false;

  return (
    <div className="status-card">
      <div className="status-card__title">
        <span>{t("checkIn")}</span>
        <Pill color={isCommitteeCheckedIn ? "blue" : "red"} text={isCommitteeCheckedIn ? t("completed") : t("awaitingAction")} />
      </div>

      {isCommitteeCheckedIn ? (
        <p className="status-card__text">{t("committeeCheckedIn")}</p>
      ) : (
        <>
          <p className="status-card__text">{t("checkInExpanation")}</p>
          <Button className="status-card__button">{t("checkIn")}</Button>
        </>
      )}
    </div>
  );
};
