import { useTranslation } from "react-i18next";
import { RoutePaths } from "navigation";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toggleMenu } from "../../actions";
import { ScreenSize } from "../../constants/constants";
import { RootState } from "../../reducers";
import "./NavLinks.scss";

export default function NavLinks() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  const handleClick = () => {
    if (screenSize === ScreenSize.Mobile) {
      dispatch(toggleMenu(false));
    }
  }

  const activeableClass = ({ isActive }) => (isActive ? "nav-link selected" : "nav-link")

  return (
    <>
      <NavLink to={RoutePaths.vaults} className={activeableClass} onClick={() => handleClick()}>{t("NavLinks.vaults")}</NavLink>
      <NavLink to={RoutePaths.gov} className={activeableClass} onClick={() => handleClick()}>{t("NavLinks.gov")}</NavLink>
      <NavLink to={RoutePaths.airdrop_machine} className={activeableClass} onClick={() => handleClick()}>{t("NavLinks.airdrop-machine")}</NavLink>
      <NavLink to={RoutePaths.vulnerability} className={({ isActive }) =>
        (isActive ? "nav-link vurnability selected" : "nav-link vulnerability")}
        onClick={() => handleClick()}>{t("NavLinks.submit-vulnerability")}</NavLink>
      <NavLink to={RoutePaths.committee_tools} className={({ isActive }) =>
        (isActive ? "nav-link selected" : "nav-link hidden")}
        onClick={() => handleClick()}>{t("NavLinks.committee-tools")}</NavLink>
      <NavLink to={RoutePaths.vault_editor} className={({ isActive }) =>
        (isActive ? "nav-link selected" : "nav-link hidden")}
        onClick={() => handleClick()}>{t("NavLinks.vault-editor")}</NavLink>
    </>
  )
}
