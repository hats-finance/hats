import React from "react";
import Logo from "../assets/icons/logo.icon";
import "../styles/HatsBreakdown.scss";

export default function HatsBreakdown() {
  return <div className="hats-breakdown-wrapper">
    <div style={{ padding: "40px" }}>
      <Logo />
    </div>
    <div className="data-top">
      <div className="data-square">
        <span>Balance</span>
        <span className="">0</span>
      </div>
      <div className="data-square">
        <span>Total Stacked</span>
        <span>0</span>
      </div>
      <div className="data-square">
        <span>Staking APY</span>
        <span>37.77%</span>
      </div>
    </div>
    <div className="data-bottom">
      <div className="data-long">
        <span>HATS price</span>
        <span>0.00</span>
      </div>
      <div className="data-long">
        <span>Total supply</span>
        <span>0.00</span>
      </div>
    </div>
  </div>
}
