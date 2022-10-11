import { DOCS, RISK_FACTOR, SocialLinks, TERMS_OF_USE } from "constants/constants";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import TelegramIcon from "assets/icons/social/telegram.icon";
import MediumIcon from "assets/icons/social/medium.icon";
import DiscordIcon from "assets/icons/social/discord.icon";
import TwitterIcon from "assets/icons/social/twitter.icon";
import GitHubIcon from "assets/icons/social/github.icon";
import { StyledSocialAndLegal } from "./styles";

export default function SocialAndLegal() {
  return (
    <StyledSocialAndLegal>
      <div className="social-wrapper">
        <a {...defaultAnchorProps} href={SocialLinks.Telegram}><TelegramIcon /></a>
        <a {...defaultAnchorProps} href={SocialLinks.Medium}><MediumIcon /></a>
        <a {...defaultAnchorProps} href={SocialLinks.Discord}><DiscordIcon /></a>
        <a {...defaultAnchorProps} href={SocialLinks.Twitter}><TwitterIcon /></a>
        <a {...defaultAnchorProps} href={SocialLinks.GitHub}><GitHubIcon /></a>
      </div>
      
      <a {...defaultAnchorProps} href={DOCS}>Docs</a>
      <a {...defaultAnchorProps} href={TERMS_OF_USE}>Terms of Use</a>
      <a {...defaultAnchorProps} href={RISK_FACTOR}>Risk Factor</a>
    </StyledSocialAndLegal>
  )
}
