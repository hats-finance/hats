import { useState, useEffect } from "react";
import useWeb3Modal from "../hooks/useWeb3Modal";
import { connect, toggleMenu } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import { getNetworkNameByChainId, getMainPath, fetchWalletBalance } from "../utils";
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

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
  <button
      className={!provider ? "wallet-btn disconnected" : "wallet-btn connected"}
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      <div>
        <span className={!provider ? "dot disconnected" : "dot connected"} style={{ marginRight: "5px" }} />{!provider ? "Connect a Wallet" : "Disconnect Wallet"}
      </div>
    </button>
  );
}

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const [showModal, setShowModal] = useState(false);
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const showMenu = useSelector((state: RootState) => state.layoutReducer.showMenu);

  useEffect(() => {
    dispatch(connect(provider || {}));
  }, [provider, dispatch]);

  useEffect(() => {
    const getWalletBalance = async () => {
      fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
    }
    if (network === NETWORK && selectedAddress && rewardsToken) {
      getWalletBalance();
    }
  }, [selectedAddress, network, rewardsToken, dispatch]);

  return (
    <header>
      {screenSize === ScreenSize.Mobile && <Logo />}
      {screenSize === ScreenSize.Desktop && (
        <>
          <div className="page-title">{Pages[getMainPath(location.pathname)]}</div>
          <button disabled={network !== NETWORK} className="hats-btn" onClick={() => setShowModal(true)}><Logo width="30" height="30" /><span>Hats</span></button>
        </>
      )}

      {screenSize !== ScreenSize.Mobile && provider && <WalletInfo />}
      <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />

      {screenSize === ScreenSize.Mobile && <div onClick={() => dispatch(toggleMenu(!showMenu))}>{showMenu ? <CloseIcon /> : <MenuIcon />}</div>}
      {showModal &&
        <Modal title="YOUR HATS BREAKDOWN" setShowModal={setShowModal} height="fit-content">
          <HatsBreakdown />
        </Modal>}
    </header>
  )
}
