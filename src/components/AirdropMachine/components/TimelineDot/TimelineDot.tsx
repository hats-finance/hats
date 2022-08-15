import "./index.scss";

interface IProps {
  left?: string;
  color?: string;
}

export default function TimelineDot({ left, color }: IProps) {
  return (
    <div className="timeline-dot-wrapper" style={{ left: left, borderImageSource: color }}>
      <div className="timeline-dot__inner-dot" style={{ backgroundColor: color }} />
    </div>
  )
}
