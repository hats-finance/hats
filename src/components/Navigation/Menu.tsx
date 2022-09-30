import NavLinks from "./NavLinks";
import "./Menu.scss"
import SoicalAndLegal from "./SoicalAndLegal";
import { useEffect } from "react";
import Languages from "components/Languages/Languages";

export default function Menu() {

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "initial";
    }
  }, []);

  return (
    <div className="menu-wrapper">
      <NavLinks />
      <SoicalAndLegal />
      <Languages />
    </div>
  )
}
