import "./index.scss";

interface IProps {
  tokenAmount: number
}

export default function TokenAirdrop({ tokenAmount }: IProps) {
  return (
    <div className="token-airdrop-wrapper">
      TOKEN AIRDROP COMPONENT
      {tokenAmount}
    </div>
  )
}
