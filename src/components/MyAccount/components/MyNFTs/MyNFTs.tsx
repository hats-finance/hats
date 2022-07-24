import { useVaults } from "hooks/useVaults";
import NFTElement from "../NFTElement/NFTElement";
import "./index.scss";

/**
 * Proof of deposit:
 * 1. Fetch staker data (all pids that the current user has deposited)
 * 2. Check only for these pids with getTiersToRedeemFromShares if it hasn't been redeemed yet
 * 3. If it's still eligibale use tokensIds to fetch the tokenId
 * 4. Use uri to fetch the ipfs uri of the NFT in order to display it
 * 
 * Tree:
 * 1. Use tokensRedeemed with the params from the JSON
 * 2. Use tokenIds to fetch the tokenId
 * 3. Use uri to fetch the ipfs uri of the NFT in order to display it
 * 
 * NOTE:
 * tokensRedeemed[hatVaults][pid][tier][account]    1<= tier <=3
 * getTiersToRedeemFromShares[hatVaults][pid][account]
 * tokenIds[hatVaults][pid][tier]
 * uri[tokenId]
 */

export default function MyNFTs() {
  // const nfts = stakerData?.map((pid, index) => {
  //   return <NFTElement key={index} pid={Number(pid)} />
  // })

  return (
    <div className="my-nfts-wrapper">
      
    </div>
  )
}
