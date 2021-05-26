import React, { useState } from "react";
import "../styles/ConnectWallet.scss";
import web3Connect from "../hooks/web3Connect";

import MetaMaskLogo from "../assets/icons/wallets/metamask.svg";
import WalletConnectLogo from "../assets/icons/wallets/walletconnect-circle.svg";
import WalletLinkLogo from "../assets/icons/wallets/coinbase.svg";
import LedgerLogo from "../assets/icons/wallets/ledger.png";
import PortisLogo from "../assets/icons/wallets/portis.svg";
import MewLogo from "../assets/icons/wallets/mewwallet.png";
import TorusLogo from "../assets/icons/wallets/torus.svg";
import FortmaticLogo from "../assets/icons/wallets/fortmatic.svg";
import AuthereumLogo from "../assets/icons/wallets/authereum.svg";

interface IProps {
    setShowModal: (show: boolean) => any
}

export default function ConnectWallet(props: IProps) {
    const [showMore, setShowMore] = useState(false);

    const [provider, useWalletConnect] = web3Connect();

    return <div className="connect-wallet-wrapper">
        <div className="terms-area">
            <input className="terms-checkbox" type="checkbox" />
            <span>I accept the Terms of Service, Legal Disclosure, and Privacy Policy</span>
        </div>
        <span>Choose your wallet</span>
        <div className="choose-wallet-area">
            <div className="wallet-row">
                <button
                    onClick={() => {}}
                    className="wallet-button"
                ><div className="wallet-button-content"><img className="wallet-logo" src={MetaMaskLogo} alt="metamask" /><span>MetaMask</span></div></button>
                <button
                    className="wallet-button"
                    onClick={() => {
                        console.log("clickety click")
                    }}
                ><div className="wallet-button-content"><img className="wallet-logo" src={WalletConnectLogo} alt="walletconnect"/><span>WalletConnect</span></div></button>
                <button
                    onClick={() => {}}
                    className="wallet-button"
                ><div className="wallet-button-content"><img className="wallet-logo" src={WalletLinkLogo} alt="walletlink" /><span>WalletLink</span></div></button>
            </div>
        </div>
        <div className="choose-wallet-area">
            <div className="wallet-row">
                <button
                    onClick={() => {}}
                    className="wallet-button"
                ><div className="wallet-button-content"><img className="wallet-logo" src={LedgerLogo} alt="ledger" /><span>Ledger</span></div></button>
                <button
                    onClick={() => {}}
                    className="wallet-button"
                ><div className="wallet-button-content"><img className="wallet-logo" src={PortisLogo} alt="portis" /><span>Portis</span></div></button>
                <button
                    onClick={() => {}}
                    className="wallet-button"
                ><div className="wallet-button-content"><img className="wallet-logo" src={MewLogo} alt="mew logo"/><span>MEW</span></div></button>
            </div>
        </div>
        <div>
            {!showMore
            ? <button className="show-more-btn" onClick={() => setShowMore(true)}>Show More</button>
            : <div className="choose-wallet-area">
                <div className="wallet-row">
                    <button
                        onClick={() => {}}
                        className="wallet-button"
                    ><div className="wallet-button-content"><img className="wallet-logo" src={TorusLogo} alt="torus" /><span>Torus</span></div></button>
                    <button
                        onClick={() => {}}
                        className="wallet-button"
                    ><div className="wallet-button-content"><img className="wallet-logo" src={FortmaticLogo} alt="fortmatic" /><span>Fortmatic</span></div></button>
                    <button
                        onClick={() => {}}
                        className="wallet-button"
                    ><div className="wallet-button-content"><img className="wallet-logo" src={AuthereumLogo} alt="authereum" /><span>Authereum</span></div></button>
                </div>
                
            </div>}
        </div>
        {!showMore
            ? <></>
            : <button className="show-more-btn" onClick={() => setShowMore(false)}>Show Less</button>}
    </div>
}