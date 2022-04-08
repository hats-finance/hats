import { useState } from "react";
import { toggleMenu } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import {
  getMainPath,
} from "../utils";
import "../styles/Header.scss";
import "../styles/global.scss";
import { ScreenSize } from "../constants/constants";
import { useLocation } from "react-router-dom";
import { Pages } from "../constants/constants";
import Modal from "./Shared/Modal";
import HatsBreakdown from "./HatsBreakdown";
import { NETWORK } from "../settings";
import MenuIcon from "../assets/icons/hamburger.icon";
import CloseIcon from "../assets/icons/close.icon";
import Logo from "../assets/icons/logo.icon";
import { RootState } from "../reducers";
import WalletInfo from "./WalletInfo/WalletInfo";
import WalletButton from "./WalletButton/WalletButton";
import millify from "millify";
import { useEthers } from "@usedapp/core";

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const screenSize = useSelector(
    (state: RootState) => state.layoutReducer.screenSize
  );
  const [showModal, setShowModal] = useState(false);
  const showMenu = useSelector(
    (state: RootState) => state.layoutReducer.showMenu
  );
  const { hatsBalance } = useSelector((state: RootState) => state.web3Reducer);
  const inTransaction = useSelector(
    (state: RootState) => state.layoutReducer.inTransaction
  );


  // useEffect(() => {
  //   const getWalletBalance = async () => {
  //     fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
  //   };
  //   if (network === NETWORK && selectedAddress && rewardsToken) {
  //     getWalletBalance();
  //   }
  // }, [selectedAddress, network, rewardsToken, dispatch]);

  const { chainId, account } = useEthers()

  return (
    <header data-testid="Header">
      {screenSize === ScreenSize.Desktop && (
        <div className="page-title">
          {Pages[getMainPath(location.pathname)]}
        </div>
      )}
      <button
        disabled={chainId !== NETWORK}
        className="hats-btn"
        onClick={() => setShowModal(true)}
      >
        <Logo width="30" height="30" />
        <span>{hatsBalance ? `${millify(hatsBalance)}` : "-"}</span>
      </button>

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
      {showModal && (
        <Modal
          title="YOUR HATS BREAKDOWN"
          setShowModal={setShowModal}
          height="fit-content"
        >
          <HatsBreakdown />
        </Modal>
      )}
    </header>
  );
}
