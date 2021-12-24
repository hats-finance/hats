import { Link } from "react-router-dom";
//import Logo from "../../assets/icons/logo.icon";
import LogoChristmas from "../../assets/icons/logo-christmas.svg";
import "../../styles/Sidebar.scss";
import NavLinks from "./NavLinks";
import SoicalAndLegal from "./SoicalAndLegal";

export default function Sidebar() {
  return (
    <div className="sidebar-wrapper">
      <Link to="/" className="logo"><img src={LogoChristmas} alt="christams logo" /></Link>
      <NavLinks />
      <div className="bottom-wrapper">
        <SoicalAndLegal />
      </div>
    </div>
  )
}
