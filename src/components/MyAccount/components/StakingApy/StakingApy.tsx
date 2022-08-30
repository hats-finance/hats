import { useTranslation } from "react-i18next";
import ApyIcon from "assets/icons/apy.svg";
import "./index.scss";

export default function StakingApy() {
  const { t } = useTranslation();

  return (
    <div className="staking-apy-wrapper">
      <img src={ApyIcon} width="40px" alt="apy graph" />
      {/* TODO: need to calculate */}
      <span className="staking-apy__value">-</span>
      <span className="staking-apy__title">{t("Header.MyAccount.StakingApy.title")}</span>
    </div>
  )
}
