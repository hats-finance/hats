import "./index.scss";

interface IProps {
  link: string;
  poster?: string;
  className?: string;
}

export function Media({ link, poster, className }: IProps) {
  return (
    <div className="media-wrapper" key={link}>
      {/* The poster is needed here in case the media is not a video */}
      <video loop autoPlay muted className={className} playsInline poster={poster ? poster : link}>
        <source src={link} type="video/mp4" />
      </video>
    </div>
  );
}
