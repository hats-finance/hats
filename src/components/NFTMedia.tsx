import { getLinkExtension, ipfsTransformUri } from "utils";
import "styles/NFTMedia.scss";

interface IProps {
  link: string
  width?: string // can be any valid css width value
}

export default function NFTMedia(props: IProps) {
  const { link, width } = props;
  const extension = getLinkExtension(link);
  const poster = !extension ? ipfsTransformUri(link) : undefined;

  return (
    <div className="nft-media-wrapper">
      <video loop autoPlay muted width={width} playsInline poster={poster}>
        <source src={ipfsTransformUri(link)} type="video/mp4" />
      </video>
    </div>
  )
}
