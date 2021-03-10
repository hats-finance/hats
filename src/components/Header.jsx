import React, { useState } from "react";
import useWeb3Modal from "../hooks/useWeb3Modal";
import { useWalletBalance } from "../hooks/utils";
import { connect } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import { truncatedAddress, getNetworkNameByChainId, getMainPath } from "../utils";
import "../styles/Header.scss";
import "../styles/global.scss";
import { ScreenSize } from "../constants/constants";
import { useLocation } from "react-router-dom";
import { Pages } from "../constants/constants";
import Lodaing from "./Shared/Loading";
import Modal from "./Shared/Modal";
import HatsBreakdown from "./HatsBreakdown";
import millify from "millify";
import { NETWORK } from "../settings";

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
  const updateWalletBalance = useWalletBalance();
  const selectedAddress = useSelector(state => state.web3Reducer.provider?.selectedAddress) ?? "";
  const { ethBalance, hatsBalance } = useSelector(state => state.web3Reducer);
  const screenSize = useSelector(state => state.layoutReducer.screenSize);
  const [showModal, setShowModal] = useState(false);
  const chainId = useSelector(state => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);

  React.useEffect(() => {
    dispatch(connect(provider || {}));
  }, [provider, dispatch]);

  React.useEffect(() => {
    const getWalletBalance = async () => {
      await updateWalletBalance();
    }
    if (network === NETWORK) {
      getWalletBalance();
    }
  }, [selectedAddress, network]);

  return (
    <header>
      {screenSize === ScreenSize.Small && <div>MENU</div>}
      <div className="page-title">{Pages[getMainPath(location.pathname)]}</div>
      <div className="wallet-wrapper">
        {provider &&
          <div className="wallet-details">
            <button disabled={network !== NETWORK} className="hats-btn" onClick={() => setShowModal(true)}>Hats</button>
            {network === NETWORK && <div style={{ position: "relative", minWidth: "50px" }}>
              {!ethBalance ? <Lodaing /> : <span>{`${millify(ethBalance)} ETH | ${millify(hatsBalance)} HATS`}</span>}
            </div>}
            <span className="current-address">{truncatedAddress(selectedAddress)}</span>
            <span>{`(${network})`}</span>
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
