import { useQuery } from "@apollo/client";
import { LIQUIDITY_POOL_APOLLO_CONTEXT } from "../constants/constants";
import { GET_INCENTIVES } from "../graphql/subgraph";
import { DATA_POLLING_INTERVAL } from "../settings";
import "../styles/LiquidityPools.scss";

export default function LiquidityPools() {
  const { loading, error, data } =   useQuery(GET_INCENTIVES, { pollInterval: DATA_POLLING_INTERVAL, context: { clientName: LIQUIDITY_POOL_APOLLO_CONTEXT } });

  if (!loading && !error && data && data.incentives) {
    console.log(data);
  }

  return (
    <div className="content liquidity-pools-wrapper">
      <span>Coming soon...</span>
    </div>
  )
}
