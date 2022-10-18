import ReactDOM from "react-dom";
import { useTransactions } from "@usedapp/core";
import { StyledModal, ModalContainer } from "./styles";
import { useCallback, useEffect } from "react";

interface HatsModalProps {
  isShowing: boolean;
  onHide: () => void;
  children: React.ReactElement;
  title?: string;
}

export function HatsModal({ isShowing, onHide, children, title }: HatsModalProps) {
  const inTransaction = useTransactions().transactions.some((tx) => !tx.receipt);

  const escapeHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && !inTransaction) onHide();
    },
    [inTransaction, onHide]
  );

  useEffect(() => {
    window.addEventListener("keydown", escapeHandler);
    return () => window.removeEventListener("keydown", escapeHandler);
  }, [escapeHandler]);

  return isShowing
    ? ReactDOM.createPortal(
        <StyledModal>
          <div className="overlay" onClick={onHide} />
          <ModalContainer>
            <div className="header">
              <div className="title">{title && <span>{title}</span>}</div>
              <button disabled={inTransaction} type="button" className="close" onClick={onHide}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="content">{children}</div>
          </ModalContainer>
        </StyledModal>,
        document.body
      )
    : null;
}
