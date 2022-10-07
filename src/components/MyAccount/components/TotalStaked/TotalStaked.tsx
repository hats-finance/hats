import { useTranslation } from "react-i18next";
import TotalStakedIcon from "assets/icons/total-staked.svg";
import { StyledTotalStaked } from "./styles";

export default function TotalStaked() {
  const { t } = useTranslation();

  return (
    <StyledTotalStaked>
      <img src={TotalStakedIcon} width="40px" alt="total staked" />
      {/* TODO: need to calculate */}
      <span className="value">-</span>
      <span className="title">{t("Header.MyAccount.TotalStaked.title")}</span>
    </StyledTotalStaked>
  );
}
