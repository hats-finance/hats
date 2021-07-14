import React, { useState } from "react";
import useWeb3Modal from "../hooks/useWeb3Modal";
import { connect } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import { truncatedAddress, getNetworkNameByChainId, getMainPath, fetchWalletBalance, linkToEtherscan } from "../utils";
import "../styles/Header.scss";
import "../styles/global.scss";
import { ScreenSize } from "../constants/constants";
import { useLocation } from "react-router-dom";
import { Pages } from "../constants/constants";
import Modal from "./Shared/Modal";
import HatsBreakdown from "./HatsBreakdown";
import millify from "millify";
import { NETWORK } from "../settings";
import MenuIcon from "../assets/icons/hamburger.icon";
import Logo from "../assets/icons/logo.icon";
import { RootState } from "../reducers";

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
  const { ethBalance, hatsBalance } = useSelector((state: RootState) => state.web3Reducer);
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const [showModal, setShowModal] = useState(false);
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const inTransaction = useSelector((state: RootState) => state.layoutReducer.inTransaction);
  const transactionHash = useSelector((state: RootState) => state.layoutReducer.transactionHash);

  React.useEffect(() => {
    dispatch(connect(provider || {}));
  }, [provider, dispatch]);

  React.useEffect(() => {
    const getWalletBalance = async () => {
      fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken, "18");
    }
    if (network === NETWORK && selectedAddress && rewardsToken) {
      getWalletBalance();
    }
  }, [selectedAddress, network, rewardsToken, dispatch]);

  return (
    <header>
      {screenSize === ScreenSize.Mobile && <MenuIcon />}
      {screenSize === ScreenSize.Mobile && <Logo />}
      <div className="page-title">{Pages[getMainPath(location.pathname)]}</div>
      <div className="wallet-wrapper">
        {screenSize !== ScreenSize.Mobile && provider &&
          <div className="wallet-details">
            <button disabled={network !== NETWORK} className="hats-btn" onClick={() => setShowModal(true)}><Logo width="30" height="30" /><span>Hats</span></button>
            {network === NETWORK &&
              <div className="wallet-balance">
                {!ethBalance ? null : <span>{`${millify(ethBalance)} ETH | ${millify(hatsBalance)} HATS`}</span>}
              </div>}
            {inTransaction ? <div onClick={() => window.open(linkToEtherscan(transactionHash, NETWORK, true))} className="pending-transaction">Pending Transaction</div> : <span>{truncatedAddress(selectedAddress)}</span>}
            <span className="network-name">{`${network}`}</span>
          </div>}
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </div>
      {showModal &&
        <Modal title="YOUR HATS BREAKDOWN" setShowModal={setShowModal} height="fit-content">
          <HatsBreakdown />
        </Modal>}
    </header>
  )
}
