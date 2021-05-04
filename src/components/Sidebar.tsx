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
      <NavLink to="/vulnerability" className="sidebar-link vulnerability" activeClassName="selected">Submit Vulnerability</NavLink>
      <NavLink to="/pools" className="sidebar-link" activeClassName="selected">Liquidity Pool</NavLink>
      <div className="bottom-wrapper">
        <div className="social-wrapper">
          <a target="_blank" rel="noopener noreferrer" href="https://t.me/joinchat/QKP3HcdosVhjOTY0"><TelegramIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://medium.com/@HatsFinance"><MediumIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/3kHJFDUs"><DiscordIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/HatsFinance"><TwitterIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/hats-finance"><GitHubIcon /></a>
        </div>
        <a target="_blank" rel="noopener noreferrer" href="https://www.google.com">Terms of service</a>
      </div>
    </div>
  )
}
