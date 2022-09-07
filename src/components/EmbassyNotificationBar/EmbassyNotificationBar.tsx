import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";

export default function EmbassyNotificationBar() {
  const { t } = useTranslation();
  const [toggle, setToggle] = useState(true);

  return (
    <>
      {toggle ? (
        <div className="embassy-notification-bar-wrapper">
          <span className="embassy-notification-bar__title">{t("EmbassyNotificationBar.title")}</span>
          <button className="fill embassy-notification-bar__learn-more-btn">{t("EmbassyNotificationBar.learn-more")}</button>
          <button onClick={() => setToggle(false)} className="embassy-notification-bar__close-btn">&times;</button>
        </div>
      ) : null}
    </>
  )
}
