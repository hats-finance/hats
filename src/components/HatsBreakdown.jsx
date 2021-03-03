import React from "react";
import Logo from "../assets/icons/logo.icon";
import "../styles/HatsBreakdown.scss";

export default function HatsBreakdown() {
  return <div className="hats-breakdown-wrapper">
    <Logo />
    <div>Your Stacked</div>
    <div>Staking API</div>
    <div>Balance</div>
    <div>Referral reward</div>
    <div>Gov reward</div>
  </div>
}
