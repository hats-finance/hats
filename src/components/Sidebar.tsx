import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/icons/logo.icon";
import TelegramIcon from "../assets/icons/social/telegram.icon";
import MediumIcon from "../assets/icons/social/medium.icon";
import DiscordIcon from "../assets/icons/social/discord.icon";
import TwitterIcon from "../assets/icons/social/twitter.icon";
import GitHubIcon from "../assets/icons/social/github.icon";
import "../styles/Sidebar.scss";
import { COOKIES_POLICY, PRIVACY_POLICY, RoutePaths, SocialLinks } from "../constants/constants";

export default function Sidebar() {

  return (
    <div className="sidebar-wrapper">
      <Link to="/" className="logo"><Logo width="50px" /></Link>
      <NavLink to={RoutePaths.vaults} className="sidebar-link" activeClassName="selected">Vaults</NavLink>
      <NavLink to={RoutePaths.pools} className="sidebar-link pools" activeClassName="selected">Liquidity Pools</NavLink>
      <NavLink to={RoutePaths.gov} className="sidebar-link" activeClassName="selected">Gov</NavLink>
      <NavLink to={RoutePaths.vulnerability} className="sidebar-link vulnerability" activeClassName="selected">Submit Vulnerability</NavLink>
      <div className="bottom-wrapper">
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
    </div>
  )
}
