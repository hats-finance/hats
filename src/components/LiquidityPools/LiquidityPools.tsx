// import { useQuery } from "@apollo/client";
// import { LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT, UNISWAP_V3_APP } from "../../constants/constants";
// import { getIncentives } from "../../graphql/subgraph";
// import { DATA_POLLING_INTERVAL } from "../../settings";
// import Loading from "../Shared/Loading";
// import "../../styles/LiquidityPools.scss";
// import LiquidityPool from "./LiquidityPool";
// import LPPreview from "./LPPreview";
// import { useSelector } from "react-redux";
// import { RootState } from "../../reducers";
// import { IIncentive } from "../../types/types";
// import { useEffect, useState } from "react";


/**
 * TODO: Temporary disable LP and show "Coming soon..."
 */

export default function LiquidityPools() {
  // const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  // const { loading, error, data } = useQuery(getIncentives(rewardsToken, false), { pollInterval: DATA_POLLING_INTERVAL, context: { clientName: LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT } });
  // const [incentives, setIncentives] = useState<IIncentive[]>([]);
  // const [showLPPreview, setShowLPPreview] = useState(sessionStorage.getItem("closedLPPreview"));

  // useEffect(() => {
  //   if (!loading && !error && data && data.incentives) {
  //     setIncentives(data.incentives);
  //   }
  // }, [loading, error, data])

  // TODO: note we assume for now we get one incentive that matches our query so we take the first in position [0]
  return (
    <div className="content liquidity-pools-wrapper">
      {/* {loading && incentives.length === 0 ? <Loading fixed /> : incentives.length === 0 ? "No Incentives" : (
        <>
          {showLPPreview !== "1" && (
            <LPPreview setShowLPPreview={setShowLPPreview}>
              <span>Uniswap V3 uses NFT tokens to represent LP positions, If you would like to participate in this inventive poolfirst go to <a target="_blank" rel="noopener noreferrer" href={UNISWAP_V3_APP}>Uniswap</a> and create a position.</span>
            </LPPreview>
          )}
          <LiquidityPool incentive={incentives[0]} />
        </>
      )} */}
      <div style={{ textAlign: "center" }}>Coming soon...</div>
    </div>
  )
}
