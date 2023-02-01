import { useTranslation } from "react-i18next";
import TokenEligibilityInfo from "../TokenEligibilityInfo/TokenEligibilityInfo";
import "./index.scss";

interface IProps {
  nextStage: () => void;
}

export default function TokenEligibility({ nextStage }: IProps) {
  const { t } = useTranslation();

  return (
    <div className="token-eligibility-wrapper">
      <span>{t("AirdropMachine.TokenEligibility.text-1")}</span>
      <TokenEligibilityInfo />
      <section>
        <b className="token-eligibility__section-title">{t("AirdropMachine.TokenEligibility.text-2")}</b>
        <span>{t("AirdropMachine.TokenEligibility.text-3")}</span>
      </section>
      <div className="token-eligibility__button-container">
        <button className="fill" onClick={nextStage}>{t("AirdropMachine.TokenEligibility.button-text")}</button>
      </div>
    </div>
  )
}
