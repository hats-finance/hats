import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Logo from "../assets/icons/logo.icon";
import { getStakerAmounts } from "../graphql/subgraph";
import { useQuery } from "@apollo/client";
import { formatNumber, fromWei, getTokenMarketCap } from "../utils";
import { IStaker, IVault } from "../types/types";
import { RootState } from "../reducers";
import "../styles/HatsBreakdown.scss";

export default function HatsBreakdown() {
  const hatsBalance = useSelector((state: RootState) => state.web3Reducer.hatsBalance);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const hatsPrice = useSelector((state: RootState) => state.dataReducer.hatsPrice);
  const vaults = useSelector((state: RootState) => state.dataReducer.vaults);
  const { loading, error, data } = useQuery(getStakerAmounts(selectedAddress), { fetchPolicy: "cache-and-network" });
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);

  const stakerAmounts = useMemo(() => {
    if (!loading && !error && data && data.stakers) {
      return data.stakers;
    }
    return [];
  }, [loading, error, data])

  const [totalStaked, setTotalStaked] = useState(0);
  const [stakingAPY, setStakingAPY] = useState(0);

  const findTokenPrice = useCallback((parentVaultID: string) => {
    for (const vault of vaults) {
      if (vault.parentVault.id === parentVaultID) {
        return vault.parentVault.tokenPrice;
      }
    }
    return 0;
  }, [vaults])

  useEffect(() => {
    const getTotalStaked = () => {
      const totalStaked = stakerAmounts.map(async (staker: IStaker) => Number(fromWei(staker.depositAmount)) * findTokenPrice(staker.parentVault.id)).reduce((a: any, b: any) => a + b, 0);
      if (!isNaN(Number(totalStaked))) {
        setTotalStaked(Number(totalStaked));
      }
      let amountToSum = 0;
      stakerAmounts.forEach((staked: IStaker) => {
        const userDepositSize = Number(fromWei(staked.depositAmount));
        const tokenValue: number = findTokenPrice(staked.parentVault.id);
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
  }, [stakerAmounts, vaults, findTokenPrice])

  const [hatsMarketCap, setHatsMarketCap] = useState(0);

  useEffect(() => {
    (async () => {
      if (rewardsToken && rewardsToken !== "") {
        setHatsMarketCap(await getTokenMarketCap(rewardsToken));
      }
    })();
  }, [rewardsToken])

  return <div className="hats-breakdown-wrapper">
    <div className="logo-wrapper">
      <Logo height="100px" />
    </div>
    <div className="data-top">
      <div className="data-square">
        <span>Balance (HATS)</span>
        <span>{formatNumber(hatsBalance)}</span>
      </div>
      <div className="data-square">
        <span>Total Staked</span>
        <span>&#8776; {`$${formatNumber(totalStaked)}`}</span>
      </div>
      <div className="data-square">
        <span>Staking APY</span>
        <span>{`${formatNumber(stakingAPY)}%`}</span>
      </div>
    </div>
    <div className="data-bottom">
      <div className="data-long">
        <span>HATS price</span>
        <span>&#8776; {`$${formatNumber(hatsPrice)}`}</span>
      </div>
      <div className="data-long">
        <span>Total supply</span>
        <span>&#8776; {`$${formatNumber(hatsMarketCap)}`}</span>
      </div>
    </div>
  </div>
}
