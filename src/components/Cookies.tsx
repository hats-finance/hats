import { useTranslation } from "react-i18next";
import { COOKIES_POLICY, LocalStorage } from "../constants/constants";
import "../styles/Cookies.scss";

interface IProps {
  setAcceptedCookies: Function;
}

export default function Cookies(props: IProps) {
  const { t } = useTranslation();

  const acceptedCookies = () => {
    localStorage.setItem(LocalStorage.Cookies, "1");
    props.setAcceptedCookies("1");
  };

  return (
    <div className="cookies-wrapper" data-testid="Cookies">
      <span>{t("Cookies.text-1")}</span>
      <div className="cookies-links-wrapper">
        <a
          className="policy-link"
          target="_blank"
          rel="noopener noreferrer"
          href={COOKIES_POLICY}
        >
          {t("Cookies.text-2")}
        </a>
        <button className="accept-button" onClick={acceptedCookies}>
          {t("Cookies.text-3")}
        </button>
      </div>
    </div>
  );
}
