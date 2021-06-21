import { IPFS_PREFIX } from "../constants/constants";
import "../styles/NFTPrize.scss";
import { ISeverity } from "../types/types";

interface IProps {
  data: ISeverity
}

export default function NFTPrize(props: IProps) {
  const severity = props.data;

  return (
    <div className="nft-prize-wrapper">
      <span className="nft-name">{severity["nft-metadata"].name}</span>
      <img src={`${IPFS_PREFIX}${severity["nft-metadata"].image.substring(12)}`} alt="NFT" className="nft-image" />
      <div className="seperator" />
      <div className="nft-info">
        <span className="subtitle">Description:</span>
        <span className="data">{severity["nft-metadata"].description}</span>
        <span className="subtitle">Severity:</span>
        <span className="data">{severity.name.toUpperCase()}</span>
      </div>
    </div>
  )
}
