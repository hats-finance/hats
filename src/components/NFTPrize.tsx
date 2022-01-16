import "../styles/NFTPrize.scss";
import { ISeverity } from "../types/types";
import NFTMedia from "./NFTMedia";

interface IProps {
  data: ISeverity
}

export default function NFTPrize(props: IProps) {
  const severity = props.data;

  return (
    <div className="nft-prize-wrapper">
      <span className="nft-name">{severity?.["nft-metadata"]?.name}</span>
      <NFTMedia link={severity?.["nft-metadata"]?.image} />
      <div className="nft-info">
        <span className="subtitle">Description:</span>
        <span className="data">{severity?.["nft-metadata"]?.description}</span>
        <span className="subtitle">Severity:</span>
        <span className="data">{severity?.name.toUpperCase()}</span>
      </div>
    </div>
  )
}
