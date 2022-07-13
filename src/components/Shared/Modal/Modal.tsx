import { useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.scss";

interface IProps {
  isShowing: boolean;
  hide: () => void;
  children: React.ReactElement;
}

export default function Modal({ isShowing, hide, children }: IProps) {

  useEffect(() => {
    document.body.style.overflow = isShowing ? "hidden" : "initial";
  }, [isShowing]);

  return (
    isShowing ? ReactDOM.createPortal(
      <>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal role="dialog">
          <div className="modal" id="modalBody">
            <div className="modal-header">
              <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {children}
          </div>
        </div>
      </>, document.body
    ) : null
  )
}
