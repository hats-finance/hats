import { ipfsTransformUri } from "utils";
import "styles/NFTMedia.scss";
import { useState } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

interface IProps {
  link: string
  width?: string // can be any valid css width value
  clickable?: boolean
}

export default function NFTMedia({ link, width, clickable }: IProps) {
  const [fullScreen, setFullScreen] = useState(false);

  const media = (
    // The poster is needed here in case the media is not a video
    <video loop autoPlay muted width={width} playsInline poster={ipfsTransformUri(link)}>
      <source src={ipfsTransformUri(link)} type="video/mp4" />
    </video>
  )

  if (fullScreen) {
    return (
      ReactDOM.createPortal(
        <div className="nft-media-full-screen-wrapper">
          <button onClick={() => setFullScreen(false)} className="nft-media-full-screen__close-btn">&times;</button>
          <div className="nft-media-full-screen__container">
            {media}
          </div>
        </div>, document.body
      )
    )
  }

  const handleClick = () => {
    if (clickable) setFullScreen(true);
  }

  return (
    <div className={classNames("nft-media-wrapper", { "clickable": clickable })} onClick={handleClick}>
      {media}
    </div>
  )
}
