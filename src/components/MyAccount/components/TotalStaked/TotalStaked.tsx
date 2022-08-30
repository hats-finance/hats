import { useTranslation } from "react-i18next";
import TotalStakedIcon from "assets/icons/total-staked.svg";
import "./index.scss";

export default function TotalStaked() {
  const { t } = useTranslation();

  return (
    <div className="total-staked-wrapper">
      <img src={TotalStakedIcon} width="40px" alt="total staked" />
      {/* TODO: need to calculate */}
      <span className="total-staked__value">-</span>
      <span className="total-staked__title">{t("Header.MyAccount.TotalStaked.title")}</span>
    </div>
  )
}
