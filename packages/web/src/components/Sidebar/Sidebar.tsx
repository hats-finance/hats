import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import Logo from "assets/icons/logo.icon";
import NavLinks from "./NavLinks/NavLinks";
import SocialAndLegal from "./SocialAndLegal/SocialAndLegal";
import Menu from "./Menu/Menu";
import { StyledSidebar } from "./styles";

export default function Sidebar() {
  const showMenu = useSelector((state: RootState) => state.layoutReducer.showMenu);

  return (
    <>
      <Menu show={showMenu} />

      <StyledSidebar className="onlyDesktop">
        <Link to="/" className="logo">
          <Logo width="50px" />
        </Link>
        <NavLinks />
        <div className="bottom-wrapper">
          <SocialAndLegal />
        </div>
      </StyledSidebar>
    </>
  );
}
