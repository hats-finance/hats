import "./SoicalAndLegal.scss"
import { COOKIES_POLICY, PRIVACY_POLICY, RoutePaths, SocialLinks } from "../../constants/constants";
import { Link } from "react-router-dom";
import TelegramIcon from "../../assets/icons/social/telegram.icon";
import MediumIcon from "../../assets/icons/social/medium.icon";
import DiscordIcon from "../../assets/icons/social/discord.icon";
import TwitterIcon from "../../assets/icons/social/twitter.icon";
import GitHubIcon from "../../assets/icons/social/github.icon";

export default function SoicalAndLegal() {
  return (
    <div className="social-legal-wrapper">
      <div className="social-wrapper">
        <a target="_blank" rel="noopener noreferrer" href={SocialLinks.Telegram}><TelegramIcon /></a>
        <a target="_blank" rel="noopener noreferrer" href={SocialLinks.Medium}><MediumIcon /></a>
        <a target="_blank" rel="noopener noreferrer" href={SocialLinks.Discord}><DiscordIcon /></a>
        <a target="_blank" rel="noopener noreferrer" href={SocialLinks.Twitter}><TwitterIcon /></a>
        <a target="_blank" rel="noopener noreferrer" href={SocialLinks.GitHub}><GitHubIcon /></a>
      </div>
      <Link to={RoutePaths.terms_of_use}>Terms of Use</Link>
      <a target="_blank" rel="noopener noreferrer" href={COOKIES_POLICY}>Cookies Policy</a>
      <a target="_blank" rel="noopener noreferrer" href={PRIVACY_POLICY}>Privacy Policy</a>
    </div>
  )
}
