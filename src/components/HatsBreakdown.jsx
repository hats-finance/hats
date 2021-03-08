import React from "react";
import { useSelector } from "react-redux";
import Logo from "../assets/icons/logo.icon";
import Loading from "./Shared/Loading";
import "../styles/HatsBreakdown.scss";

export default function HatsBreakdown() {
  const hatsBalance = useSelector(state => state.web3Reducer.hatsBalance);
  return <div className="hats-breakdown-wrapper">
    <div style={{ padding: "40px" }}>
      <Logo />
    </div>
    <div className="data-top">
      <div className="data-square">
        <span>Balance</span>
        {!hatsBalance ? <Loading /> : <span className="">{Number(hatsBalance).toFixed(2)}</span>}
      </div>
      <div className="data-square">
        <span>Total Stacked</span>
        <span>???</span>
      </div>
      <div className="data-square">
        <span>Staking APY</span>
        <span>???%</span>
      </div>
    </div>
    <div className="data-bottom">
      <div className="data-long">
        <span>HATS price</span>
        <span>???</span>
      </div>
      <div className="data-long">
        <span>Total supply</span>
        <span>???</span>
      </div>
    </div>
  </div>
}
