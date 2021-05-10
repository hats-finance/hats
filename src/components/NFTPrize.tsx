import React, { useState } from "react";
import "../styles/NFTPrize.scss";
import { ISeverity } from "../types/types";
import { getNFTData } from "../utils";
import Loading from "./Shared/Loading";

interface IProps {
  data: ISeverity
}

export default function NFTPrize(props: IProps) {
  const [nftData, setNFTData] = useState();

  React.useEffect(() => {
    const fetchNFTData = async () => {
      setNFTData(await getNFTData());
    }
    fetchNFTData();
  }, []);

  const severity = props.data;

  return !nftData ? <Loading /> :
    <div className="nft-prize-wrapper">
      <div className="nft-info">
        <span className="nft-name">{(nftData as any).name}</span>
        <span className="subtitle">Info:</span>
        <span className="data">{(nftData as any).description}</span>
        <span className="subtitle">Severity:</span>
        <span className="data">{severity.name.toUpperCase()}</span>
        <span className="subtitle">Creator:</span>
        <span className="data">{(nftData as any).creator.address}</span>
      </div>
      <img src={(nftData as any).image_preview_url} alt="NFT" />
    </div>
}
