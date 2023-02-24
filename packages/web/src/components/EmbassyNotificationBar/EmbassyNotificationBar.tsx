import { useTranslation } from "react-i18next";
import { EMBASSY_LEARN_MORE, LocalStorage } from "constants/constants";
import "./index.scss";

type EmbassyNotificationBarProps = {
  setHasSeenEmbassyNotification: () => void;
};

export default function EmbassyNotificationBar({ setHasSeenEmbassyNotification }: EmbassyNotificationBarProps) {
  const { t } = useTranslation();

  const handleClose = () => {
    localStorage.setItem(LocalStorage.EmbassyNotification, "1");
    setHasSeenEmbassyNotification();
  };

  return (
    <div className="embassy-notification-bar-wrapper">
      <span className="embassy-notification-bar__title">{t("EmbassyNotificationBar.title")}</span>
      <button onClick={() => window.open(EMBASSY_LEARN_MORE)} className="fill embassy-notification-bar__learn-more-btn">
        {t("EmbassyNotificationBar.learn-more")}
      </button>
      <button onClick={handleClose} className="embassy-notification-bar__close-btn">
        &times;
      </button>
    </div>
  );
}
