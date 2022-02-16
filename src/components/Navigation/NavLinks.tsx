import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, Switch } from "react-router-dom";
import { toggleMenu } from "../../actions";
import { RoutePaths, ScreenSize } from "../../constants/constants";
import { RootState } from "../../reducers";
import "./NavLinks.scss";

export default function NavLinks() {
  const dispatch = useDispatch();
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  const handleClick = () => {
    if (screenSize === ScreenSize.Mobile) {
      dispatch(toggleMenu(false));
    }
  }

  return (
    <>
      <NavLink to={RoutePaths.vaults} className="nav-link" activeClassName="selected" onClick={() => handleClick()}>Vaults</NavLink>
      <NavLink to={RoutePaths.pools} className="nav-link" activeClassName="selected" onClick={() => handleClick()}>Liquidity Pools</NavLink>
      <NavLink to={RoutePaths.gov} className="nav-link" activeClassName="selected" onClick={() => handleClick()}>Gov</NavLink>
      <NavLink to={RoutePaths.nft_airdrop} className="nav-link" activeClassName="selected" onClick={() => handleClick()}>NFT Airdrop</NavLink>
      <NavLink to={RoutePaths.vulnerability} className="nav-link vulnerability" activeClassName="selected" onClick={() => handleClick()}>Submit Vulnerability</NavLink>
      <Switch>
        <Route path={`${RoutePaths.committee_tools}`}>
          <NavLink to={RoutePaths.committee_tools} className="nav-link" activeClassName="selected" onClick={() => handleClick()}>Committee Tools</NavLink>
        </Route>
      </Switch>

    </>
  )
}
