import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../assets/icons/logo.icon";
import TelegramIcon from "../assets/icons/social/telegram.icon";
import MediumIcon from "../assets/icons/social/medium.icon";
import DiscordIcon from "../assets/icons/social/discord.icon";
import TwitterIcon from "../assets/icons/social/twitter.icon";
import GitHubIcon from "../assets/icons/social/github.icon";
import "../styles/Sidebar.scss";
import { COOKIES_POLICY, PRIVACY_POLICY, RoutePaths, SocialLinks } from "../constants/constants";
import { IVault } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducers";
import ArrowIcon from "../assets/icons/arrow.icon";
import { getMainPath } from "../utils";
import { updateLiquidityPool } from "../actions";

export default function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [showPools, setShowPools] = useState(`/${getMainPath(location.pathname)}` === RoutePaths.pools ? true : false);
  const currentPoolID = useSelector((state: RootState) => state.layoutReducer.liquidityPoolID);
  const poolsData = useSelector((state: RootState) => state.dataReducer.vaults);
  const pools = poolsData.filter((element: IVault) => element.parentVault.liquidityPool);

  const poolsLinks = pools.map((pool: IVault) => {
    return (
      <div key={pool.id} className="pool-link-wrapper">
        <span className={currentPoolID === pool.id ? "selected" : ""} onClick={() => dispatch(updateLiquidityPool(pool.id))}>- {pool.name}</span>
      </div>
    )
  })

  return (
    <div className="sidebar-wrapper">
      <Link to="/" className="logo"><Logo width="50px" /></Link>
      <NavLink to={RoutePaths.vaults} className="sidebar-link" activeClassName="selected" onClick={() => setShowPools(false)}>Vaults</NavLink>
      <NavLink to={RoutePaths.pools} className="sidebar-link pools" activeClassName="selected" onClick={() => setShowPools(true)}>
        <span>Liquidity Pools</span>
        <div className={showPools ? "arrow open" : "arrow"}><ArrowIcon /></div>
      </NavLink>
      {showPools && <div className="pools-links-wrapper">{poolsLinks}</div>}
      <NavLink to={RoutePaths.gov} className="sidebar-link" activeClassName="selected" onClick={() => setShowPools(false)}>Gov</NavLink>
      <NavLink to={RoutePaths.vulnerability} className="sidebar-link vulnerability" activeClassName="selected" onClick={() => setShowPools(false)}>Submit Vulnerability</NavLink>
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
