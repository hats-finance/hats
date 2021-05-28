import React, { useState } from "react";
import { useSelector } from "react-redux";
import Logo from "../assets/icons/logo.icon";
import Loading from "./Shared/Loading";
import "../styles/HatsBreakdown.scss";
import millify from "millify";
import { getStakerAmounts } from "../graphql/subgraph";
import { useQuery } from "@apollo/react-hooks";
import { fromWei, getTokenMarketCap, getTokenPrice } from "../utils";
import { IStaker } from "../types/types";
import { RootState } from "../reducers";

export default function HatsBreakdown() {
  const hatsBalance = useSelector((state: RootState) => state.web3Reducer.hatsBalance);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const hatsPrice = useSelector((state: RootState) => state.dataReducer.hatsPrice);
  const vaults = useSelector((state: RootState) => state.dataReducer.vaults);
  const { loading, error, data } = useQuery(getStakerAmounts(selectedAddress), { fetchPolicy: "cache-and-network" });
  // sum(user deposit size * token value * vault APY)/number of vaults in sum
  // forEachVault(stakerAmounts[x].amount * getTokenPrice(stakerAmounts[x].vault.stakingToken) * ...) / stakerAmounts.length

  const stakerAmounts = React.useMemo(() => {
    if (!loading && !error && data && data.stakers) {
      return data.stakers;
    }
    return [];
  }, [loading, error, data])

  const [totalStaked, setTotalStaked] = useState(0);
  const [stakingAPY, setStakingAPY] = useState(0);

  React.useEffect(() => {
    const getTotalStaked = async () => {
      // TODO: should be staking token, e.g. staker.vault.stakingToken
      const totalStaked = await (await Promise.all(stakerAmounts.map(async (staker: IStaker) => Number(fromWei(staker.amount)) * await getTokenPrice("0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf")))).reduce((a: any, b: any) => a + b, 0);
      setTotalStaked(totalStaked as any);
      const sumOfStaked = stakerAmounts.forEach(async (v, i) => {
        const userDepositAmount = Number(fromWei(v.amount))
        const tokenValue = await getTokenPrice(v.vault.stakingToken)
        let apy = 0;
        vaults.forEach((vault) => {
          if (vault.stakingToken === v.vault.stakingToken) {
            apy = vault.apy
          }
        });
        return userDepositAmount * tokenValue * apy;
      }).reduce((a: any, b: any) => a + b, 0);
      setStakingAPY(sumOfStaked / vaults.length)
    }
    if (stakerAmounts.length > 0) {
      getTotalStaked();
    }
    console.log(stakerAmounts)
    console.log(vaults)
  }, [stakerAmounts])

  const [hatsMarketCap, setHatsMarketCap] = useState(0);

  React.useEffect(() => {
    const getHatsMarketCap = async () => {
      // TODO: Should be HATS token - e.g. rewards token
      setHatsMarketCap(await getTokenMarketCap("0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf"));
    }
    getHatsMarketCap();
  }, [])

  return <div className="hats-breakdown-wrapper">
    <div style={{ padding: "40px" }}>
      <Logo />
    </div>
    <div className="data-top">
      <div className="data-square">
        <span>Balance (HATS)</span>
        {!hatsBalance ? <Loading top="60%" /> : <span>{millify(hatsBalance)}</span>}
      </div>
      <div className="data-square">
        <span>Total Staked</span>
        {loading ? <Loading top="60%" /> : <span>&#8776; {`$${millify(totalStaked)}`}</span>}
      </div>
      <div className="data-square">
        <span>Staking APY</span>
        <span>???%</span> {/* should be stakingAPY when that can be verified it is working */}
      </div>
    </div>
    <div className="data-bottom">
      <div className="data-long">
        <span>HATS price</span>
        {!hatsPrice ? <Loading right="0px" /> : <span>&#8776; {`$${millify(hatsPrice)}`}</span>}
      </div>
      <div className="data-long">
        <span>Total supply</span>
        {!hatsMarketCap ? <Loading right="0px" /> : <span>&#8776; {`$${millify(hatsMarketCap)}`}</span>}
      </div>
    </div>
  </div>
}
