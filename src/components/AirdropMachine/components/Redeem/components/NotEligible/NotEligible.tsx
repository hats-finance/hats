import { useTranslation } from "react-i18next";
import "./index.scss";

interface IProps {
  closeRedeemModal: () => void;
}

export default function NotEligible({ closeRedeemModal }: IProps) {
  const { t } = useTranslation();

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
