import { shortenIfAddress, useEthers } from "@usedapp/core";
import { useTranslation } from "react-i18next";
import Balance from "./components/Balance/Balance";
import MyNFTs from "./components/MyNFTs/MyNFTs";
import StakingApy from "./components/StakingApy/StakingApy";
import TotalStaked from "./components/TotalStaked/TotalStaked";
import "./index.scss";

export default function MyAccount() {
  const { t } = useTranslation();
  const { account } = useEthers();

  return (
    <div className="my-account-wrapper">
      <div className="my-account__wallet">
        <span className="my-account__hello">{t("Header.MyAccount.hello")},</span>
        <span className="my-account__address">{shortenIfAddress(account)}</span>
      </div>
      <div className="my-account__top-wrapper">
        <Balance />
        <TotalStaked />
        <StakingApy />
      </div>
      <MyNFTs />
    </div>
  )
}
