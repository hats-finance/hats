import "../styles/NFTPrize.scss";
import { ISeverity } from "../types/types";

interface IProps {
  data: ISeverity
}

export default function NFTPrize(props: IProps) {
  const severity = props.data;

  return (
    <div className="nft-prize-wrapper">
      <div className="nft-info">
        <span className="nft-name">{severity["nft-metadata"].name}</span>
        <span className="subtitle">Info:</span>
        <span className="data">{severity["nft-metadata"].description}</span>
        <span className="subtitle">Severity:</span>
        <span className="data">{severity.name.toUpperCase()}</span>
      </div>
      <img src={`https://ipfs.io/ipfs/${severity["nft-metadata"].image.substring(12)}`} alt="NFT" className="nft-image" />
    </div>
  )
}
