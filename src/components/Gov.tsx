import { useTranslation } from "react-i18next";
import DiscordIcon from "../assets/icons/social/discord.icon";
import { GOV_DISCORD_LINK } from "../constants/constants";
import "../styles/Gov.scss";

export default function Gov() {
  const { t } = useTranslation();
  
  return (
    <div className="content gov-wrapper">
      <a target="_blank" rel="noopener noreferrer" href={GOV_DISCORD_LINK}>
        {t("Gov.forum-link")}&nbsp;<DiscordIcon />
      </a>
    </div>
  )
}
