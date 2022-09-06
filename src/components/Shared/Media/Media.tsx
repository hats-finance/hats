import { ipfsTransformUri } from "utils";
import "./index.scss";

interface IProps {
  link: string;
  width?: string; // can be any valid css width value
  ipfsLink?: boolean;
  maxHeight?: string;
  maxWidth?: string;
}

export default function Media({ link, width, ipfsLink, maxHeight, maxWidth }: IProps) {
  return (
    <div className="media-wrapper">
      {/* The poster is needed here in case the media is not a video */}
      <video loop autoPlay muted style={{ width: width, maxHeight: maxHeight, maxWidth: maxWidth }} playsInline poster={ipfsLink ? ipfsTransformUri(link) : link}>
        <source src={ipfsLink ? ipfsTransformUri(link) : link} type="video/mp4" />
      </video>
    </div>
  )
}
