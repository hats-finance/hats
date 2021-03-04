import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/icons/logo.icon";
import TelegramIcon from "../assets/icons/social/telegram.icon";
import MediumIcon from "../assets/icons/social/medium.icon";
import DiscordIcon from "../assets/icons/social/discord.icon";
import TwitterIcon from "../assets/icons/social/twitter.icon";
import GitHubIcon from "../assets/icons/social/github.icon";
import "../styles/Sidebar.scss";

export default function Sidebar() {
  return (
    <div className="sidebar-wrapper">
      <Link to="/" className="logo"><Logo /></Link>
      <NavLink to="/honeypots" className="sidebar-link" activeClassName="selected">Honeypots</NavLink>
      <NavLink to="/gov" className="sidebar-link" activeClassName="selected">Gov</NavLink>
      <div className="bottom-wrapper">
        <div className="social-wrapper">
          <a target="_blank" rel="noopener noreferrer" href="https://www.google.com"><TelegramIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.google.com"><MediumIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.google.com"><DiscordIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.google.com"><TwitterIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.google.com"><GitHubIcon /></a>
        </div>
        <a target="_blank" rel="noopener noreferrer" href="https://www.google.com">Terms of service</a>
      </div>
    </div>
  )
}
