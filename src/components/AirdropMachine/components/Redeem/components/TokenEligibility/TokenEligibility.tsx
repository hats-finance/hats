import { useTranslation } from "react-i18next";
import { shortenIfAddress } from "@usedapp/core";
import HatsLogo from "assets/icons/hats-logo-circle.svg";
import RadioButtonChecked from "assets/icons/radio-button-checked.svg";
import RadioButton from "assets/icons/radio-button.svg";
import millify from "millify";
import { BigNumber } from "ethers";
import { formatUnits } from "@ethersproject/units";
import "./index.scss";
import { useContext } from "react";
import { AirdropMachineContext } from "components/AirdropMachine/components/CheckEligibility/CheckEligibility";

interface IProps {
  nextStage: () => void;
}

export default function TokenEligibility({ nextStage }: IProps) {
  const { t } = useTranslation();
  const { nftData: { actualAddress, actualAddressInfo } } = useContext(AirdropMachineContext);
  if (!actualAddressInfo) return <></>;
  const { token_eligibility } = actualAddressInfo;


  const totalHatsEligibility = Object.values(token_eligibility)
    .reduce((a, b) => a.add(b), BigNumber.from(0));

  return (
    <div className="token-eligibility-wrapper">
      <span>{t("AirdropMachine.TokenEligibility.text-1")}</span>
      <div className="token-eligibility__total-hats-container">
        <span>{`${shortenIfAddress(actualAddress)} ${t("AirdropMachine.TokenEligibility.text-2")}`}</span>
        <div className="token-eligibility__total-hats">
          <img src={HatsLogo} alt="hats logo" />
          <span className="token-eligibility__value">{millify(Number(formatUnits(totalHatsEligibility)))} HATS</span>
        </div>
      </div>
      <div className="token-eligibility__breakdown-wrapper">

        <div className="token-eligibility__breakdown-element">
          <div className="token-eligibility__breakdown_element-name">
            <b>{t("AirdropMachine.TokenEligibility.text-3")}</b>
          </div>
          <div className="token-eligibility__breakdown_element-value">
            <u>{t("AirdropMachine.TokenEligibility.text-4")}</u>
          </div>
        </div>

        <div className="token-eligibility__breakdown-element">
          <div className="token-eligibility__breakdown_element-name">
            <img src={BigNumber.from(token_eligibility.committee_member).gt(0) ? RadioButtonChecked : RadioButton} alt="radio button" />
            {t("AirdropMachine.TokenEligibility.text-5")}
          </div>
          <div className="token-eligibility__breakdown_element-value">
            {millify(Number(formatUnits(token_eligibility.committee_member)))} HATS
          </div>
        </div>

        <div className="token-eligibility__breakdown-element">
          <div className="token-eligibility__breakdown_element-name">
            <img src={BigNumber.from(token_eligibility.depositor).gt(0) ? RadioButtonChecked : RadioButton} alt="radio button" />
            {t("AirdropMachine.TokenEligibility.text-6")}
          </div>
          <div className="token-eligibility__breakdown_element-value">
            {millify(Number(formatUnits(token_eligibility.depositor)))} HATS
          </div>
        </div>

        <div className="token-eligibility__breakdown-element">
          <div className="token-eligibility__breakdown_element-name">
            <img src={BigNumber.from(token_eligibility.crow).gt(0) ? RadioButtonChecked : RadioButton} alt="radio button" />
            {t("AirdropMachine.TokenEligibility.text-7")}
          </div>
          <div className="token-eligibility__breakdown_element-value">
            {millify(Number(formatUnits(token_eligibility.crow)))} HATS
          </div>
        </div>

        <div className="token-eligibility__breakdown-element">
          <div className="token-eligibility__breakdown_element-name">
            <img src={BigNumber.from(token_eligibility.coder).gt(0) ? RadioButtonChecked : RadioButton} alt="radio button" />
            {t("AirdropMachine.TokenEligibility.text-8")}
          </div>
          <div className="token-eligibility__breakdown_element-value">
            {millify(Number(formatUnits(token_eligibility.coder)))} HATS
          </div>
        </div>


        <div className="token-eligibility__breakdown-element">
          <div className="token-eligibility__breakdown_element-name">
            <img src={BigNumber.from(token_eligibility.early_contributor).gt(0) ? RadioButtonChecked : RadioButton} alt="radio button" />
            {t("AirdropMachine.TokenEligibility.text-9")}
          </div>
          <div className="token-eligibility__breakdown_element-value">
            {millify(Number(formatUnits(token_eligibility.early_contributor)))} HATS
          </div>
        </div>


        <div className="token-eligibility__breakdown-element total">
          <div className="token-eligibility__breakdown_element-name">
            {t("AirdropMachine.TokenEligibility.text-10")}
          </div>
          <div className="token-eligibility__breakdown_element-value">
            {millify(Number(formatUnits(totalHatsEligibility)))} HATS
          </div>
        </div>

      </div>

      <section>
        <b className="token-eligibility__section-title">{t("AirdropMachine.TokenEligibility.text-11")}</b>
        <span>{t("AirdropMachine.TokenEligibility.text-12")}</span>
      </section>

      <button className="fill" onClick={nextStage}>{t("AirdropMachine.TokenEligibility.button-text")}</button>
    </div>
  )
}
