import React from "react";
import { useSelector } from "react-redux";
import Logo from "../assets/icons/logo.icon";
import Loading from "./Shared/Loading";
import "../styles/HatsBreakdown.scss";
import millify from "millify";
import { getStakerAmounts } from "../graphql/subgraph";
import { useQuery } from "@apollo/react-hooks";
import { BigNumber } from "@ethersproject/bignumber";
import { fromWei } from "../utils";
import { IStaker } from "../types/types";

export default function HatsBreakdown() {
  const hatsBalance = useSelector(state => (state as any).web3Reducer.hatsBalance);
  const selectedAddress = useSelector(state => (state as any).web3Reducer.provider?.selectedAddress) ?? "";
  const { loading, error, data } = useQuery(getStakerAmounts(selectedAddress));

  // TODO: need to refetch when necessary
  const totalStaked: BigNumber = React.useMemo(() => {
    if (!loading && !error && data && data.stakers) {
      return data.stakers.map((staker: IStaker) => BigNumber.from(staker.amount)).reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from(0)) ?? BigNumber.from(0);
    }
    return BigNumber.from(0);
  }, [loading, error, data])

  return <div className="hats-breakdown-wrapper">
    <div style={{ padding: "40px" }}>
      <Logo />
    </div>
    <div className="data-top">
      <div className="data-square">
        <span>Balance</span>
        {!hatsBalance ? <Loading top="60%" /> : <span>{millify(hatsBalance)}</span>}
      </div>
      <div className="data-square">
        <span>Total Staked</span>
        {loading ? <Loading top="60%" /> : <span>{millify(Number(fromWei(totalStaked)))}</span>}
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
