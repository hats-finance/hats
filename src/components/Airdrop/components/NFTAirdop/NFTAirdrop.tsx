import "./index.scss";

interface IProps {
  tokenId: string
}

export default function NFTAirdrop({ tokenId }: IProps) {
  return (
    <div className="nft-airdrop-wrapper">
      NFT AIRDROP COMPONENT
      {tokenId}
    </div>
  )
}
