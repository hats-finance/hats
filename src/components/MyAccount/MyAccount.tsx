import { shortenIfAddress, useEthers } from "@usedapp/core";
import { useTranslation } from "react-i18next";
import MyNFTs from "./components/MyNFTs/MyNFTs";
import Balance from "./components/Balance/Balance";
import StakingApy from "./components/StakingApy/StakingApy";
import TotalStaked from "./components/TotalStaked/TotalStaked";
import { StyledMyAccountInfo } from "./styles";

export default function MyAccount() {
  const { t } = useTranslation();
  const { account } = useEthers();

  return (
    <StyledMyAccountInfo>
      <div className="wallet">
        <span className="wallet__hello">{t("Header.MyAccount.hello")},</span>
        <span className="wallet__address">{shortenIfAddress(account)}</span>
      </div>
      <div className="stats-boxs">
        <Balance />
        <TotalStaked />
        <StakingApy />
      </div>
      <MyNFTs />
    </StyledMyAccountInfo>
  )
}
