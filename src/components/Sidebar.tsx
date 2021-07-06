import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../assets/icons/logo.icon";
import TelegramIcon from "../assets/icons/social/telegram.icon";
import MediumIcon from "../assets/icons/social/medium.icon";
import DiscordIcon from "../assets/icons/social/discord.icon";
import TwitterIcon from "../assets/icons/social/twitter.icon";
import GitHubIcon from "../assets/icons/social/github.icon";
import "../styles/Sidebar.scss";
import { RoutePaths } from "../constants/constants";
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
  const pools = poolsData.filter((element: IVault) => element.liquidityPool);

  const poolsLinks = pools.map((pool: IVault) => {
    return (
      <div key={pool.id} className="pool-link-wrapper">
        <span className={currentPoolID === pool.id ? "selected" : ""} onClick={() => dispatch(updateLiquidityPool(pool.id))}>- {pool.name.split(' ', 1)[0]}</span>
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
          <a target="_blank" rel="noopener noreferrer" href="https://t.me/joinchat/QKP3HcdosVhjOTY0"><TelegramIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://medium.com/@HatsFinance"><MediumIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/xDphwRGyW7"><DiscordIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/HatsFinance"><TwitterIcon /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/hats-finance"><GitHubIcon /></a>
        </div>
        <Link to={RoutePaths.terms_of_service}>Terms of Service</Link>
      </div>
    </div>
  )
}
