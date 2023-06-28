import { useRef } from "react";
import { StyledMedia } from "./styles";

interface MediaProps {
  link: string;
  poster?: string;
  className?: string;
  playOnHover?: boolean;
}

export function Media({ link, poster, className, playOnHover }: MediaProps) {
  const videoRef = useRef(null);

  const handlePlay = () => {
    if (playOnHover) (videoRef?.current as any)?.play();
  };

  const handlePause = () => {
    if (playOnHover) (videoRef?.current as any)?.pause();
  };

  return (
    <StyledMedia key={link}>
      {/* The poster is needed here in case the media is not a video */}
      <video
        onMouseEnter={handlePlay}
        onMouseLeave={handlePause}
        ref={videoRef}
        loop
        autoPlay={!playOnHover}
        muted
        className={className}
        playsInline
        poster={poster ? poster : link}
        onLoadedData={() => {
          if (videoRef && playOnHover) {
            (videoRef?.current as any)?.play();
            (videoRef?.current as any)?.pause();
          }
        }}
      >
        <source src={link} type="video/mp4" />
      </video>
    </StyledMedia>
  );
}
