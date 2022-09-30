import Languages from "components/Languages/Languages";
import { Link } from "react-router-dom";
import Logo from "../../assets/icons/logo.icon";
import "../../styles/Sidebar.scss";
import NavLinks from "./NavLinks";
import SoicalAndLegal from "./SoicalAndLegal";

export default function Sidebar() {
  return (
    <div className="sidebar-wrapper">
      <Link to="/" className="logo"><Logo width="50px" /></Link>
      <NavLinks />
      <div className="bottom-wrapper">
        <SoicalAndLegal />
        <Languages />
      </div>
    </div>
  )
}
