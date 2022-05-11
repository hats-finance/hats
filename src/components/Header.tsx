import { toggleMenu } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import { useEthers } from "@usedapp/core";
import {
  getMainPath,
} from "../utils";
import { ScreenSize } from "../constants/constants";
import { useLocation } from "react-router-dom";
import { Pages } from "../constants/constants";
import MenuIcon from "../assets/icons/hamburger.icon";
import CloseIcon from "../assets/icons/close.icon";
import { RootState } from "../reducers";
import WalletInfo from "./WalletInfo/WalletInfo";
import WalletButton from "./WalletButton/WalletButton";
import "../styles/Header.scss";
import "../styles/global.scss";
import Logo from "assets/icons/logo.icon";

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const screenSize = useSelector(
    (state: RootState) => state.layoutReducer.screenSize
  );
  const showMenu = useSelector(
    (state: RootState) => state.layoutReducer.showMenu
  );
  const inTransaction = useSelector(
    (state: RootState) => state.layoutReducer.inTransaction
  );
  const { account } = useEthers();

  return (
    <header data-testid="Header">
      {screenSize === ScreenSize.Desktop && (
        <div className="page-title">
          {Pages[getMainPath(location.pathname)]}
        </div>
      )}
      {screenSize === ScreenSize.Mobile && <Logo />}
      {account && <WalletInfo />}
      {(screenSize === ScreenSize.Desktop ||
        (screenSize === ScreenSize.Mobile && !inTransaction)) && (
          <WalletButton />
        )}

      {screenSize === ScreenSize.Mobile && (
        <div onClick={() => dispatch(toggleMenu(!showMenu))}>
          {showMenu ? <CloseIcon /> : <MenuIcon />}
        </div>
      )}
    </header>
  );
}
