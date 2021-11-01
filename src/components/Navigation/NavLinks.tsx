import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
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
      <NavLink to={RoutePaths.vulnerability} className="nav-link vulnerability" activeClassName="selected" onClick={() => handleClick()}>Submit Vulnerability</NavLink>
    </>
  )
}
