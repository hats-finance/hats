import { useTranslation } from "react-i18next";
import "./index.scss";

export default function StakingApy() {
  const { t } = useTranslation();
  
  return (
    <div className="staking-apy-wrapper">
      <span className="staking-apy__title">{t("Header.MyAccount.StakingApy.title")}</span>
      <span className="staking-apy__value">???</span>
    </div>
  )
}
