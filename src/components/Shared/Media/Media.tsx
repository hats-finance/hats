import { ipfsTransformUri } from "utils";
import "./index.scss";

interface IProps {
  link: string;
  poster?: string;
  ipfsLink?: boolean;
  className?: string;
}

export default function Media({ link, poster, ipfsLink, className }: IProps) {
  return (
    <div className="media-wrapper">
      {/* The poster is needed here in case the media is not a video */}
      <video loop autoPlay muted className={className} playsInline poster={poster ? poster : ipfsLink ? ipfsTransformUri(link) : link}>
        <source src={ipfsLink ? ipfsTransformUri(link) : link} type="video/mp4" />
      </video>
    </div>
  )
}
