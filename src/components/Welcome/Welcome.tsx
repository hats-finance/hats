import React from "react";
import { useTranslation } from "react-i18next";
import { LocalStorage } from "../../constants/constants";
import Logo from "../../assets/icons/logo.icon";
import "styles/Welcome.scss";

interface IProps {
  setHasSeenWelcomePage: Function;
}

export default function Welcome(props: IProps) {
  const { t } = useTranslation();

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "initial";
    };
  }, []);

  const seenWelcomePage = () => {
    localStorage.setItem(LocalStorage.WelcomePage, "1");
    props.setHasSeenWelcomePage("1");
  };

  return (
    <div className="welcome-wrapper" data-testid="Welcome">
      <div className="welcome-content">
        <Logo />
        <div className="title">{t("Welcome.title")}</div>
        <div className="description">{t("Welcome.description")}</div>
        <button className="enter-btn" onClick={seenWelcomePage}>
          {t("Welcome.button")}
        </button>
      </div>
    </div>
  );
}
