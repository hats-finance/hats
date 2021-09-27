import { useQuery } from "@apollo/client";
import { LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT } from "../../constants/constants";
import { getIncentives } from "../../graphql/subgraph";
import { DATA_POLLING_INTERVAL } from "../../settings";
import Loading from "../Shared/Loading";
import "../../styles/LiquidityPools.scss";
import LiquidityPool from "./LiquidityPool";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

export default function LiquidityPools() {
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const { loading, error, data } = useQuery(getIncentives(rewardsToken, false), { pollInterval: DATA_POLLING_INTERVAL, context: { clientName: LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT } });

  if (!loading && !error && data && data.incentives) {
    console.log(data);
  }

  return (
    <div className="content liquidity-pools-wrapper">
      {loading ? <Loading fixed /> : <LiquidityPool />}
    </div>
  )
}
