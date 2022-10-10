import { DOCS, RISK_FACTOR, SocialLinks, TERMS_OF_USE } from "constants/constants";
import TelegramIcon from "assets/icons/social/telegram.icon";
import MediumIcon from "assets/icons/social/medium.icon";
import DiscordIcon from "assets/icons/social/discord.icon";
import TwitterIcon from "assets/icons/social/twitter.icon";
import GitHubIcon from "assets/icons/social/github.icon";
import { StyledSocialAndLegal } from "./styles";

const linkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
}

export default function SocialAndLegal() {
  return (
    <StyledSocialAndLegal>
      <div className="social-wrapper">
        <a {...linkProps} href={SocialLinks.Telegram}><TelegramIcon /></a>
        <a {...linkProps} href={SocialLinks.Medium}><MediumIcon /></a>
        <a {...linkProps} href={SocialLinks.Discord}><DiscordIcon /></a>
        <a {...linkProps} href={SocialLinks.Twitter}><TwitterIcon /></a>
        <a {...linkProps} href={SocialLinks.GitHub}><GitHubIcon /></a>
      </div>
      
      <a {...linkProps} href={DOCS}>Docs</a>
      <a {...linkProps} href={TERMS_OF_USE}>Terms of Use</a>
      <a {...linkProps} href={RISK_FACTOR}>Risk Factor</a>
    </StyledSocialAndLegal>
  )
}
