import { shortenIfAddress, useEthers } from "@usedapp/core";
import { useTranslation } from "react-i18next";
import MyNFTs from "./components/MyNFTs/MyNFTs";
import "./index.scss";

export default function MyAccount() {
  const { t } = useTranslation();
  const { account } = useEthers();

  return (
    <div className="my-account-wrapper">
      <div className="my-account__wallet">
        <span className="my-account__hello">{t("MyAccount.hello")},</span>
        <span className="my-account__address">{shortenIfAddress(account)}</span>
      </div>
      <MyNFTs />
    </div>
  )
}
