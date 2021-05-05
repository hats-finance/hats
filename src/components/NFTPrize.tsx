
import "../styles/NFTPrize.scss";
import { ISeverity } from "../types/types";

interface IProps {
  data: ISeverity
}

export default function NFTPrize(props: IProps) {
  const severity = props.data;
  return <div className="nft-prize-wrapper">
    <div className="nft-info">
      <span>NFT name</span>
      <span className="subtitle">Info:</span>
      <span className="subtitle">Severity:</span>
      <span className="data">{severity.name.toUpperCase()}</span>
      <span className="subtitle">Creator:</span>
    </div>
    <img src={severity["nft-link"]} alt="NFT" />
  </div>
}
