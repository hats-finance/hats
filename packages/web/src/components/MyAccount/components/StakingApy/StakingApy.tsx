import { useTranslation } from "react-i18next";
import ApyIcon from "assets/icons/apy.svg";
import { StyledStakingApy } from "./styles";

export default function StakingApy() {
  const { t } = useTranslation();

  return (
    <StyledStakingApy >
      <img src={ApyIcon} width="40px" alt="apy graph" />
      {/* TODO: need to calculate */}
      <span className="value">-</span>
      <span className="title">{t("Header.MyAccount.StakingApy.title")}</span>
    </StyledStakingApy>
  )
}
