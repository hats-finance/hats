import NavLinks from "./NavLinks";
import "./Menu.scss"
import SocialAndLegal from "./SocialAndLegal";
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
      <SocialAndLegal />
      <Languages />
    </div>
  )
}
