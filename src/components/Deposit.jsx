import React, { useState } from "react";
import { useSelector } from "react-redux";
import { isDigitsOnly } from "../utils";
import Loading from "./Shared/Loading";
//import Logo from "../assets/icons/logo.icon";
import InfoIcon from "../assets/icons/info.icon";
import "../styles/Deposit.scss";

export default function Deposit() {
  const [userInput, setUserInput] = useState(0);
  const walletBalance = useSelector(state => state.web3Reducer.balance);
  const notEnoughBalance = userInput > Number(walletBalance);
  return <div className="deposit-wrapper">
    <div className="balance-wrapper">
      <span>Amount</span>
      {!walletBalance ? <div style={{ position: "relative", minWidth: "50px" }}><Loading /></div> : <span>{`Balance: ${Number(walletBalance).toFixed(2)} ETH`}</span>}
    </div>
    <div>
      <div className="amount-wrapper">
        <div className="top">
          <span>Pool token</span>
          <span>&#8776; $0.00</span>
        </div>
        <div className="input-wrapper">
          <span>HATS</span>
          <input type="number" value={userInput} onChange={(e) => { isDigitsOnly && setUserInput(e.target.value)}} min="0" />
        </div>
        {notEnoughBalance && <span className="insufficient-funds">Insufficient funds</span>}
      </div>
    </div>
    <div>
      <button className="percentage-btn" onClick={() => setUserInput((25 / 100) * walletBalance)}>25%</button>
      <button className="percentage-btn" onClick={() => setUserInput((50 / 100) * walletBalance)}>50%</button>
      <button className="percentage-btn" onClick={() => setUserInput((75 / 100) * walletBalance)}>75%</button>
      <button className="percentage-btn" onClick={() => setUserInput(walletBalance)}>100%</button>
    </div>
    <div className="staked-wrapper">
      <span>You staked</span>
      <span>0</span>
    </div>
    <div className="earnings-wrapper">
      <span>Monthly earnings &nbsp; <InfoIcon/></span>
      <span>0 Hats</span>
      <span>$0.00</span>
    </div>
    <div className="earnings-wrapper">
      <span>Yearly earnings &nbsp; <InfoIcon/></span>
      <span>0 Hats</span>
      <span>$0.00</span>
    </div>
    <div className="action-btn-wrapper">
      <button disabled={notEnoughBalance || !userInput} className="action-btn">DEPOSIT</button>
    </div>
    <div className="alt-actions-wrapper">
      <button className="alt-action-btn">CLAIM</button>
      <button className="alt-action-btn">EXIT</button>
    </div>
  </div>
}
