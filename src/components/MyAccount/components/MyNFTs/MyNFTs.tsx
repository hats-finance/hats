import { useVaults } from "hooks/useVaults";
import NFTElement from "../NFTElement/NFTElement";
import "./index.scss";


// fetch by staker "pid"
// run the loop only on the "pids"
// call tokensRedeemed[hatVaults][pid][tier][account]     1<= tier <=3
// getTierFromShares (only on the pids from Staker query) [hatVaults, pid, account] // checks if it's eligiable (hasn’t redeemed yet)

// From tree - only tokensRedeemed (according the tree - no need the query)



// to fetch URI need tokenId
// use tokenIds [account the constant, pid, tier]


export default function MyNFTs() {
  const { stakerData } = useVaults();
  const nfts = stakerData?.map((pid, index) => {
    return <NFTElement key={index} pid={pid} />
  })

  return (
    <div className="my-nfts-wrapper">
      {nfts}
    </div>
  )
}
