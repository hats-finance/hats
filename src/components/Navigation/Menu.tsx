import NavLinks from "./NavLinks";
import "./Menu.scss"
import SocialAndLegal from "./SocialAndLegal";
import { useEffect } from "react";

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
    </div>
  )
}
