import RadioButtonChecked from "assets/icons/radio-button-checked.svg";
import { useTranslation } from "react-i18next";
import DiscordIcon from "assets/icons/social/discord.icon";
import "./index.scss";

export default function RedeemTicketSuccess() {
  const { t } = useTranslation();

  return (
    <div className="redeem-ticket-success-wrapper">
      <div className="redeem-ticket-success__title">{t("EmbassyNftTicketPrompt.RedeemTicketSuccess.title")}</div>
      {t("EmbassyNftTicketPrompt.RedeemTicketSuccess.text-1")}
      <b>{t("EmbassyNftTicketPrompt.RedeemTicketSuccess.text-2")}</b>
      <div className="redeem-ticket-success__features-wrapper">
        <div className="redeem-ticket-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("EmbassyNftTicketPrompt.RedeemTicketSuccess.text-3")}
        </div>
        <div className="redeem-ticket-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("EmbassyNftTicketPrompt.RedeemTicketSuccess.text-4")}
        </div>
        <div className="redeem-ticket-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("EmbassyNftTicketPrompt.RedeemTicketSuccess.text-5")}
        </div>
      </div>
      <button className="redeem-ticket-success__join-embassy-btn">
        <DiscordIcon />
        &nbsp;
        {t("EmbassyNftTicketPrompt.RedeemTicketSuccess.button-text")}
      </button>
    </div>
  )
}
