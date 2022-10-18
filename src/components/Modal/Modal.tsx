import { useTransactions } from "@usedapp/core";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.scss";

interface IProps {
  isShowing: boolean;
  hide: () => void;
  children: React.ReactElement;
  title?: string;
}

export function Modal({ isShowing, hide, children, title }: IProps) {
  const inTransaction = useTransactions().transactions.some(tx => !tx.receipt);

  return (
    isShowing ? ReactDOM.createPortal(
      <>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal role="dialog">
          <div className="modal" id="modalBody">
            <div className="modal-header">
              <div className="modal-header__icon-title-wrapper">
                {title && <span>{title}</span>}
              </div>
              <button disabled={inTransaction} type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
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
