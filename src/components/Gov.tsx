import DiscordIcon from "../assets/icons/social/discord.icon";
import { GOV_DISCORD_LINK } from "../constants/constants";
import "../styles/Gov.scss";

export default function Gov() {
  return (
    <div className="content gov-wrapper">
      <a target="_blank" rel="noopener noreferrer" href={GOV_DISCORD_LINK}>
        Forum in Discord&nbsp; <DiscordIcon />
      </a>
    </div>
  )
}
