import { IMAGES_EXTENTIONS, IPFS_PREFIX, VIDEOS_EXTENTIONS } from "../constants/constants";
import "../styles/NFTMedia.scss";
import { getLinkExtension } from "../utils";

interface IProps {
  link: string
  width?: string // can be any valid css width value
}

export default function NFTMedia(props: IProps) {
  const { link, width } = props;
  const extension = getLinkExtension(link);

  return (
    <div className="nft-media-wrapper">
      {IMAGES_EXTENTIONS.includes(extension) ?
        <img
          className="nft-image"
          src={`${IPFS_PREFIX}/${link.substring(12)}`}
          alt="NFT"
          width={width} /> :
        VIDEOS_EXTENTIONS.includes(extension) ?
          <video loop autoPlay muted width={width} playsInline>
            <source src={`${IPFS_PREFIX}/${link.substring(12)}`} type="video/mp4" />
          </video> :
          <span>Unsupported media</span>}
    </div>
  )
}
