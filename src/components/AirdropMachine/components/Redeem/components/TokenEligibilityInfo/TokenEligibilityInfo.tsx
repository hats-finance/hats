import { formatUnits } from "@ethersproject/units";
import { shortenIfAddress } from "@usedapp/core";
import { BigNumber } from "ethers";
import millify from "millify";
import { useTranslation } from "react-i18next";
import HatsLogo from "assets/icons/hats-logo-circle.svg";
import RadioButtonChecked from "assets/icons/radio-button-checked.svg";
import RadioButton from "assets/icons/radio-button.svg";
import "./index.scss";
import { useVaults } from "hooks/useVaults";

export default function TokenEligibilityInfo() {
  const { t } = useTranslation();
  const { nftData } = useVaults();
  if (!nftData?.actualAddressInfo) return <></>;
  const { token_eligibility } = nftData?.actualAddressInfo;


  const totalHatsEligibility = Object.values(token_eligibility)
    .reduce((a, b) => a.add(b), BigNumber.from(0));
  return (
    <div>
      <div className="token-eligibility-info__total-hats-container">
        <span>{`${shortenIfAddress(nftData?.actualAddress)} ${t("AirdropMachine.TokenEligibilityInfo.text-2")}`}</span>
        <div className="token-eligibility-info__total-hats">
          <img className="token-eligibility-info__hats-logo" src={HatsLogo} alt="hats logo" />
          <span className="token-eligibility-info__value">{millify(Number(formatUnits(totalHatsEligibility)))} HATS</span>
        </div>
      </div>
      <div className="token-eligibility-info__breakdown-wrapper">

        <div className="token-eligibility-info__breakdown-element">
          <div className="token-eligibility-info__breakdown_element-name">
            <b>{t("AirdropMachine.TokenEligibilityInfo.text-3")}</b>
          </div>
          <div className="token-eligibility-info__breakdown_element-value">
            <u>{t("AirdropMachine.TokenEligibilityInfo.text-4")}</u>
          </div>
        </div>

        <div className="token-eligibility-info__breakdown-element">
          <div className="token-eligibility-info__breakdown_element-name">
            <img src={BigNumber.from(token_eligibility.committee_member).gt(0) ? RadioButtonChecked : RadioButton} alt="radio button" />
            {t("AirdropMachine.TokenEligibilityInfo.text-5")}
          </div>
          <div className="token-eligibility-info__breakdown_element-value">
            {millify(Number(formatUnits(token_eligibility.committee_member)))} HATS
          </div>
        </div>

        <div className="token-eligibility-info__breakdown-element">
          <div className="token-eligibility-info__breakdown_element-name">
            <img src={BigNumber.from(token_eligibility.depositor).gt(0) ? RadioButtonChecked : RadioButton} alt="radio button" />
            {t("AirdropMachine.TokenEligibilityInfo.text-6")}
          </div>
          <div className="token-eligibility-info__breakdown_element-value">
            {millify(Number(formatUnits(token_eligibility.depositor)))} HATS
          </div>
        </div>

        <div className="token-eligibility-info__breakdown-element">
          <div className="token-eligibility-info__breakdown_element-name">
            <img src={BigNumber.from(token_eligibility.crow).gt(0) ? RadioButtonChecked : RadioButton} alt="radio button" />
            {t("AirdropMachine.TokenEligibilityInfo.text-7")}
          </div>
          <div className="token-eligibility-info__breakdown_element-value">
            {millify(Number(formatUnits(token_eligibility.crow)))} HATS
          </div>
        </div>

        <div className="token-eligibility-info__breakdown-element">
          <div className="token-eligibility-info__breakdown_element-name">
            <img src={BigNumber.from(token_eligibility.coder).gt(0) ? RadioButtonChecked : RadioButton} alt="radio button" />
            {t("AirdropMachine.TokenEligibilityInfo.text-8")}
          </div>
          <div className="token-eligibility-info__breakdown_element-value">
            {millify(Number(formatUnits(token_eligibility.coder)))} HATS
          </div>
        </div>


        <div className="token-eligibility-info__breakdown-element">
          <div className="token-eligibility-info__breakdown_element-name">
            <img src={BigNumber.from(token_eligibility.early_contributor).gt(0) ? RadioButtonChecked : RadioButton} alt="radio button" />
            {t("AirdropMachine.TokenEligibilityInfo.text-9")}
          </div>
          <div className="token-eligibility-info__breakdown_element-value">
            {millify(Number(formatUnits(token_eligibility.early_contributor)))} HATS
          </div>
        </div>


        <div className="token-eligibility-info__breakdown-element total">
          <div className="token-eligibility-info__breakdown_element-name">
            {t("AirdropMachine.TokenEligibilityInfo.text-10")}
          </div>
          <div className="token-eligibility-info__breakdown_element-value">
            {millify(Number(formatUnits(totalHatsEligibility)))} HATS
          </div>
        </div>
      </div>
    </div>
  )
}
