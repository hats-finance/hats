import { useQuery } from "@apollo/client";
import { LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT } from "../../constants/constants";
import { getIncentives } from "../../graphql/subgraph";
import { DATA_POLLING_INTERVAL } from "../../settings";
import Loading from "../Shared/Loading";
import "../../styles/LiquidityPools.scss";
import LiquidityPool from "./LiquidityPool";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { IIncentive } from "../../types/types";
import { useEffect, useState } from "react";

export default function LiquidityPools() {
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const { loading, error, data } = useQuery(getIncentives(rewardsToken, false), { pollInterval: DATA_POLLING_INTERVAL, context: { clientName: LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT } });
  const [incentives, setIncentives] = useState([]);

  useEffect(() => {
    if (!loading && !error && data && data.incentives) {
      setIncentives(data.incentives);
    }
  }, [loading, error, data])

  // TODO: temporary - show only this incentive
  return (
    <div className="content liquidity-pools-wrapper">
      {incentives.length === 0 ? <Loading fixed /> : <LiquidityPool incentive={incentives.filter((incentive: IIncentive)=> incentive.id === "0x96c4ed92424f1682883fef9ed9e6e7dc0bc1c1f939b946ea800d689961b6bc3f")[0]} />}
    </div>
  )
}
