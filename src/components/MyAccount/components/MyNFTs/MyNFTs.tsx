import { useEthers } from "@usedapp/core";
import { useBalanceOf, useTokenIdsCounter } from "hooks/airdropContractHooks";
import "./index.scss";

export default function MyNFTs() {
  const tokensCounter = Number(useTokenIdsCounter()?.toString());

  const nfts: any = []
  for (let index = 0; index < tokensCounter; index++) {
    nfts.push(<NFTElement key={index} index={index} />)
  }

  return (
    <div className="my-nfts-wrapper">
      {nfts}
    </div>
  )
}


const NFTElement = ({ index }) => {
  const { account } = useEthers();
  const balance = useBalanceOf(account!, index);

  return (
    <div>{balance?.toString()}</div>
  )
}
