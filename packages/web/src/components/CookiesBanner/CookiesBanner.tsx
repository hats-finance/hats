import { Button } from "components/Button/Button";
import { COOKIES_POLICY, LocalStorage } from "constants/constants";
import { useTranslation } from "react-i18next";
import { StyledCookiesBanner } from "./styles";

interface CookiesBannerProps {
  onAcceptedCookies: Function;
}

export function CookiesBanner({ onAcceptedCookies }: CookiesBannerProps) {
  const { t } = useTranslation();

  const handleAcceptCookies = () => {
    localStorage.setItem(LocalStorage.Cookies, "1");
    onAcceptedCookies();
  };

  const handleOpenCookiesPolicy = () => {
    window.open(COOKIES_POLICY, "_blank");
  };

  return (
    <StyledCookiesBanner>
      <p>{t("cookiesExplanation")}</p>

      <div className="buttons">
        <Button onClick={handleOpenCookiesPolicy} styleType="text" textColor="secondary">
          {t("cookiesPolicy")}
        </Button>
        <Button onClick={handleAcceptCookies}>{t("accept")}</Button>
      </div>
    </StyledCookiesBanner>
  );
}
