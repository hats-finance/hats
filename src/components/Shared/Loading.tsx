import "../../styles/Shared/Loading.scss";
import classNames from "classnames";
import ReactDOM from "react-dom";

interface IProps {
  fixed?: boolean;
  top?: string; // can be any valid css top value
  right?: string // can be any valid css right value
  hatLoader?: boolean
  extraText?: string
}

export default function Loading(props: IProps) {
  const { fixed, top, right, hatLoader, extraText } = props;

  const styles = {
    "top": top ?? "50%",
    "right": right ?? "50%"
  }

  const loadingClass = classNames({
    "loading-wrapper": true,
    "fixed": fixed,
    "hatLoader": hatLoader
  })

  return ReactDOM.createPortal(
    <div className={loadingClass} style={styles}>
      <div className={!hatLoader ? "spinner" : "hat-loader"} />
      {extraText && <span className="extra-text">{extraText}</span>}
    </div>, document.body
  )
}
