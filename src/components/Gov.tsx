import React from "react";
import DiscordIcon from "../assets/icons/social/discord.icon";
import "../styles/Gov.scss";

export default function Gov() {
  return (
    <div className="content gov-wrapper">
      <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/3kHJFDUs">
        Forum in Discord
        <DiscordIcon />
      </a>
    </div>
  )
}
