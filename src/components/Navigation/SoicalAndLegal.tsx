import "./SoicalAndLegal.scss"
import { DOCS, RISK_FACTOR, SocialLinks, TERMS_OF_USE } from "../../constants/constants";
import TelegramIcon from "../../assets/icons/social/telegram.icon";
import MediumIcon from "../../assets/icons/social/medium.icon";
import DiscordIcon from "../../assets/icons/social/discord.icon";
import TwitterIcon from "../../assets/icons/social/twitter.icon";
import GitHubIcon from "../../assets/icons/social/github.icon";
import { useTranslation } from "react-i18next";

export default function SoicalAndLegal() {
  const { t } = useTranslation();
  
  return (
    <div className="social-legal-wrapper">
      <div className="social-wrapper">
        <a target="_blank" rel="noopener noreferrer" href={SocialLinks.Telegram}><TelegramIcon /></a>
        <a target="_blank" rel="noopener noreferrer" href={SocialLinks.Medium}><MediumIcon /></a>
        <a target="_blank" rel="noopener noreferrer" href={SocialLinks.Discord}><DiscordIcon /></a>
        <a target="_blank" rel="noopener noreferrer" href={SocialLinks.Twitter}><TwitterIcon /></a>
        <a target="_blank" rel="noopener noreferrer" href={SocialLinks.GitHub}><GitHubIcon /></a>
      </div>
      <a target="_blank" rel="noopener noreferrer" href={DOCS}>{t("SoicalAndLegal.docs")}</a>
      <a target="_blank" rel="noopener noreferrer" href={TERMS_OF_USE}>{t("SoicalAndLegal.terms-of-use")}</a>
      <a target="_blank" rel="noopener noreferrer" href={RISK_FACTOR}>{t("SoicalAndLegal.risk-factor")}</a>
    </div>
  )
}
