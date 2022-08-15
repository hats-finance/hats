import { useTranslation } from "react-i18next";
import "./index.scss";

export default function TotalStaked() {
  const { t } = useTranslation();
  
  return (
    <div className="total-staked-wrapper">
      <span className="total-staked__title">{t("Header.MyAccount.TotalStaked.title")}</span>
      <span className="total-staked__value">???</span>
    </div>
  )
}
