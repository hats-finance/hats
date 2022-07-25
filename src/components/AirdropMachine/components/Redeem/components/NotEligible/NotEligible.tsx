import { AirdropMachineContext } from "components/AirdropMachine/components/CheckEligibility/CheckEligibility";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";

export default function NotEligible() {
  const { t } = useTranslation();
  const { closeRedeemModal } = useContext(AirdropMachineContext);

  return (
    <div className="not-eligible-wrapper">
      <div className="not-eligible__title">{t("AirdropMachine.NotEligible.title")}</div>
      <div>{t("AirdropMachine.NotEligible.text-1")}</div>
      <button
        onClick={closeRedeemModal}
        className="check-other-wallet-button fill">
        {t("AirdropMachine.NotEligible.button-text")}
      </button>
    </div>
  )
}
