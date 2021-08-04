import React, { useState } from "react";
import { useSelector } from "react-redux";
import Logo from "../assets/icons/logo.icon";
import "../styles/HatsBreakdown.scss";
import millify from "millify";
import { getStakerAmounts } from "../graphql/subgraph";
import { useQuery } from "@apollo/react-hooks";
import { fromWei, getTokenMarketCap, getTokenPrice } from "../utils";
import { IStaker, IVault } from "../types/types";
import { RootState } from "../reducers";

export default function HatsBreakdown() {
  const hatsBalance = useSelector((state: RootState) => state.web3Reducer.hatsBalance);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const hatsPrice = useSelector((state: RootState) => state.dataReducer.hatsPrice);
  const vaults = useSelector((state: RootState) => state.dataReducer.vaults);
  const { loading, error, data } = useQuery(getStakerAmounts(selectedAddress), { fetchPolicy: "cache-and-network" });
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);

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
      const totalStaked = await (await Promise.all(stakerAmounts.map(async (staker: IStaker) => Number(fromWei(staker.depositAmount)) * await getTokenPrice(staker.parentVault.stakingToken)))).reduce((a: any, b: any) => a + b, 0);
      if (!isNaN(Number(totalStaked))) {
        setTotalStaked(Number(totalStaked));
      }
      let amountToSum = 0;
      stakerAmounts.forEach(async (staked: IStaker) => {
        const userDepositSize = Number(fromWei(staked.depositAmount));
        const tokenValue: number = await getTokenPrice(staked.parentVault.stakingToken);
        let vaultAPY = 0;
        if (tokenValue) {
          vaults.forEach((vault: IVault) => {
            if (staked.parentVault.stakingToken === vault.parentVault.stakingToken) {
              vaultAPY = vault.parentVault.apy
            }
          });
          amountToSum = amountToSum + (userDepositSize * tokenValue * vaultAPY);
          setStakingAPY(amountToSum / stakerAmounts.length);
        }
      });
    }
    if (stakerAmounts.length > 0) {
      getTotalStaked();
    }
  }, [stakerAmounts, vaults])

  const [hatsMarketCap, setHatsMarketCap] = useState(0);

  React.useEffect(() => {
    const getHatsMarketCap = async () => {
      setHatsMarketCap(await getTokenMarketCap(rewardsToken));
    }
    getHatsMarketCap();
  }, [rewardsToken])

  return <div className="hats-breakdown-wrapper">
    <div className="logo-wrapper">
      <Logo height="100px" />
    </div>
    <div className="data-top">
      <div className="data-square">
        <span>Balance (HATS)</span>
        {!hatsBalance ? "-" : <span>{millify(hatsBalance)}</span>}
      </div>
      <div className="data-square">
        <span>Total Staked</span>
        {!totalStaked ? "-" : <span>&#8776; {`$${millify(totalStaked)}`}</span>}
      </div>
      <div className="data-square">
        <span>Staking APY</span>
        {!stakingAPY ? "-" : <span>{millify(stakingAPY)}%</span>}
      </div>
    </div>
    <div className="data-bottom">
      <div className="data-long">
        <span>HATS price</span>
        {!hatsPrice ? "-" : <span>&#8776; {`$${millify(hatsPrice)}`}</span>}
      </div>
      <div className="data-long">
        <span>Total supply</span>
        {!hatsMarketCap ? "-" : <span>&#8776; {`$${millify(hatsMarketCap)}`}</span>}
      </div>
    </div>
  </div>
}
