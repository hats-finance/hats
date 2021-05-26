import React, { useState } from "react";
import "../styles/ConnectWallet.scss";
import web3Connect from "../hooks/web3Connect";

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
                ><span>MetaMask</span></button>
                <button
                    className="wallet-button"
                    onClick={() => {
                        console.log("clickety click")
                    }}
                ><span>WalletConnect</span></button>
                <button
                    onClick={() => {}}
                    className="wallet-button"
                ><span>WalletLink</span></button>
            </div>
        </div>
        <div className="choose-wallet-area">
            <div className="wallet-row">
                <button
                    onClick={() => {}}
                    className="wallet-button"
                ><span>Ledger</span></button>
                <button
                    onClick={() => {}}
                    className="wallet-button"
                ><span>Portis</span></button>
                <button
                    onClick={() => {}}
                    className="wallet-button"
                ><span>MEW</span></button>
            </div>
        </div>
        <div className="show-more-area">
            {!showMore
            ? <button className="show-more-btn" onClick={() => setShowMore(true)}>Show More</button>
            : <div className="choose-wallet-area">
                <div className="wallet-row">
                    <button
                        onClick={() => {}}
                        className="wallet-button"
                    ><span>Torus</span></button>
                    <button
                        onClick={() => {}}
                        className="wallet-button"
                    ><span>Fortmatic</span></button>
                    <button
                        onClick={() => {}}
                        className="wallet-button"
                    ><span>Authereum</span></button>
                </div>
                
            </div>}
        </div>
        {!showMore
            ? <></>
            : <button className="show-more-btn" onClick={() => setShowMore(false)}>Show Less</button>}
    </div>
}