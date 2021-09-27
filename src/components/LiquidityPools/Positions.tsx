import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT, UNISWAP_V3_APP } from "../../constants/constants";
import { getPositions } from "../../graphql/subgraph";
import { RootState } from "../../reducers";
import { DATA_POLLING_INTERVAL } from "../../settings";
import { IPosition } from "../../types/types";
import "./Positions.scss";

export default function Positions() {
  const [selectedPosition, setSelectedPosition] = useState<IPosition>();
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  let { loading, error, data } = useQuery(getPositions(selectedAddress), { pollInterval: DATA_POLLING_INTERVAL, context: { clientName: LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT } });

  let positions = [];

  if (!loading && !error && data && data.positions) {
    console.log(data);
    positions = data.positions.map((position: IPosition) => {
      const positionClassname = selectedPosition?.id === position.id ? "position selected" : "position";
      return (
        <div key={position.id} className={positionClassname} onClick={() => setSelectedPosition(position)}>
          <div className="nft-label">NFT</div>
          {position.tokenId}
        </div>
      )
    })
  }


  return (
    <div className="positions-wrapper">
      <div>Uniswap V3 uses NFT tokens to represent LP positions. Your Uniswap V3 LP tokens eligible for Hats rewards are listed below.</div>

      {loading ? <span className="loading">loading...</span> : (
        <>
          <span className="sub-title">{positions.length === 0 ? "You do not have any HAT-ETH LP NFTs." : "Your HAT-ETH LP NFTs"}</span>
          <div className="positions-list">{positions}</div>
          {positions.length === 0 ? <span>Go to <a target="_blank" rel="noopener noreferrer" href={UNISWAP_V3_APP}>Uniswap</a> to create a position.</span> : "Select NFT to stake"}
        </>
      )}

      {selectedPosition && <button>{selectedPosition.staked ? "UNSTAKE" : "STAKE"}</button>}

    </div>
  )
}
