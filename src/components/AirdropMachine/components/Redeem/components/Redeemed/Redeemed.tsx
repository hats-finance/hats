import { AirdropMachineContext } from "components/AirdropMachine/components/CheckEligibility/CheckEligibility";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import TokenEligibilityInfo from "../TokenEligibilityInfo/TokenEligibilityInfo";
import "./index.scss";

export default function Redeemed() {
  const { t } = useTranslation();
  const { closeRedeemModal } = useContext(AirdropMachineContext);

  return (
    <div className="redeemed-wrapper">
      <div className="redeemed__title">{t("AirdropMachine.Redeemed.title")}</div>
      <div>{t("AirdropMachine.Redeemed.text-1")}</div>
      <TokenEligibilityInfo />
      <button
        onClick={closeRedeemModal}
        className="check-other-wallet-button fill">
        {t("AirdropMachine.Redeemed.button-text")}
      </button>
    </div>
  )
}
