import DiscordIcon from "assets/icons/social/discord.icon";
import MediumIcon from "assets/icons/social/medium.icon";
import TelegramIcon from "assets/icons/social/telegram.icon";
import TwitterIcon from "assets/icons/social/twitter.icon";
import { SocialLinks } from "constants/constants";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { useTranslation } from "react-i18next";

export const CuratorSubmitted = () => {
  const { t } = useTranslation();

  return (
    <div className="curator-step">
      <div className="title">{t("CuratorForm.thanksForSubmission")}</div>
      <p>{t("CuratorForm.hatsWillReview")}</p>
      <p>{t("CuratorForm.followHatsSocials")}</p>

      <div className="socials">
        <a href={SocialLinks.Telegram} {...defaultAnchorProps}>
          <TelegramIcon />
        </a>
        <a href={SocialLinks.Medium} {...defaultAnchorProps}>
          <MediumIcon />
        </a>
        <a href={SocialLinks.Discord} {...defaultAnchorProps}>
          <DiscordIcon />
        </a>
        <a href={SocialLinks.Twitter} {...defaultAnchorProps}>
          <TwitterIcon />
        </a>
      </div>
    </div>
  );
};
