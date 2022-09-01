import { shortenIfAddress, useEthers } from "@usedapp/core";
import { AirdropMachineContext } from "components/AirdropMachine/components/CheckEligibility/CheckEligibility";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import RadioButton from "assets/icons/radio-button.svg";
import NotEligibleWalletIcon from "assets/icons/wallet-nfts/wallet-not-eligible.svg";
import "./index.scss";

export default function NotEligible() {
  const { t } = useTranslation();
  const { account } = useEthers();
  const { closeRedeemModal } = useContext(AirdropMachineContext);

  return (
    <div className="not-eligible-wrapper">
      <img className="not-eligible__not-eligible-icon" src={NotEligibleWalletIcon} alt="wallet" />
      <div className="not-eligible__title">{t("AirdropMachine.NotEligible.title")}</div>
      <div className="not-eligible__sub-title">{t("AirdropMachine.NotEligible.text-1")}</div>
      <div className="not-eligible__wallet-container">
        <span>{t("AirdropMachine.NotEligible.text-2")}</span>
        <div className="not-eligible__wallet-address">
          {shortenIfAddress(account)}
        </div>
      </div>
      <div className="not-eligible__criterias-wrapper">
        <div className="not-eligible__criterias-top">
          <b>{t("AirdropMachine.NotEligible.text-3")}</b>
          <u>{t("AirdropMachine.NotEligible.text-4")}</u>
        </div>
        <div className="not-eligible__criteria">
          <img src={RadioButton} alt="radio button" />
          <span>{t("AirdropMachine.NotEligible.criteria-1")}</span>
        </div>
        <div className="not-eligible__criteria">
          <img src={RadioButton} alt="radio button" />
          <span>{t("AirdropMachine.NotEligible.criteria-2")}</span>
        </div>
        <div className="not-eligible__criteria">
          <img src={RadioButton} alt="radio button" />
          <span>{t("AirdropMachine.NotEligible.criteria-3")}</span>
        </div>
        <div className="not-eligible__criteria">
          <img src={RadioButton} alt="radio button" />
          <span>{t("AirdropMachine.NotEligible.criteria-4")}</span>
        </div>
        <div className="not-eligible__criteria">
          <img src={RadioButton} alt="radio button" />
          <span>{t("AirdropMachine.NotEligible.criteria-5")}</span>
        </div>
      </div>
      <button
        onClick={closeRedeemModal}
        className="check-other-wallet-button fill">
        {t("AirdropMachine.NotEligible.button-text")}
      </button>
    </div>
  )
}
