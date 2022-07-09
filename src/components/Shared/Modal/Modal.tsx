import ReactDOM from "react-dom";
import "./index.scss";

const Modal = ({ isShowing, hide, children }) => isShowing ? ReactDOM.createPortal(
  <>
    <div className="modal-overlay" />
    <div className="modal-wrapper" aria-modal role="dialog">
      <div className="modal">
        <div className="modal-header">
          <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  </>, document.body
) : null;

export default Modal;
