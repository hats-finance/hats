import "./LPPreview.scss";

interface IProps {
  children: React.ReactNode
  setShowLPPreview: Function
}

export default function LPPreview(props: IProps) {
  return (
    <div className="lp-preview-wrapper">
      <div className="preview-content">{props.children}</div>
      <div className="close" onClick={() => { sessionStorage.setItem("closedLPPreview", "1"); props.setShowLPPreview("1"); }}>&times;</div>
    </div>
  )
}
