import "../../styles/Shared/Loading.scss";
import classNames from "classnames";
import ReactDOM from "react-dom";

interface IProps {
  fixed?: boolean;
  top?: string; // can be any valid css top value
  right?: string // can be any valid css right value
  spinner?: boolean
  extraText?: string
  domElement?: HTMLElement // any valid HTML DOM element
}

export default function Loading(props: IProps) {
  const { fixed, top, right, spinner, extraText, domElement } = props;

  const styles = {
    "top": top ?? "50%",
    "right": right ?? "50%"
  }

  const loadingClass = classNames({
    "loading-wrapper": true,
    "fixed": fixed,
    "hatLoader": !spinner
  })

  return ReactDOM.createPortal(
    <div className={loadingClass} style={styles}>
      <div className={spinner ? "spinner" : "hat-loader"} />
      {extraText && <span className="extra-text">{extraText}</span>}
    </div>, domElement ? domElement : document.body
  )
}
