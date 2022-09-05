import { ipfsTransformUri } from "utils";
import "./index.scss";

interface IProps {
  link: string;
  width?: string; // can be any valid css width value
  ipfsLink?: boolean;
}

export default function Media({ link, width, ipfsLink }: IProps) {
  return (
    <div className="media-wrapper">
      {/* The poster is needed here in case the media is not a video */}
      <video loop autoPlay muted width={width} playsInline poster={ipfsLink ? ipfsTransformUri(link) : link}>
        <source src={ipfsLink ? ipfsTransformUri(link) : link} type="video/mp4" />
      </video>
    </div>
  )
}
