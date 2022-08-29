import { ipfsTransformUri } from "utils";
import "styles/NFTMedia.scss";

interface IProps {
  link: string
  width?: string // can be any valid css width value
  className?: string
}

export default function NFTMedia(props: IProps) {
  const { link, width } = props;

  return (
    <div className="nft-media-wrapper">
      {/* The poster is needed here in case the media is not a video */}
      <video className={props.className} loop autoPlay muted width={width} playsInline poster={ipfsTransformUri(link)}>
        <source src={ipfsTransformUri(link)} type="video/mp4" />
      </video>
    </div>
  )
}
