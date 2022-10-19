import ReactDOM from "react-dom";
import { useTransactions } from "@usedapp/core";
import { StyledModal, ModalContainer } from "./styles";
import { useCallback, useEffect, useState } from "react";

interface HatsModalProps {
  isShowing: boolean;
  onHide: () => void;
  children: React.ReactElement;
  title?: string;
  titleIcon?: string | React.ReactElement;
  withTitleDivider?: boolean;
  removeHorizontalPadding?: boolean;
  capitalizeTitle?: boolean;
}

export function HatsModal({
  isShowing,
  onHide,
  children,
  title,
  titleIcon,
  withTitleDivider = false,
  removeHorizontalPadding = false,
  capitalizeTitle = false,
}: HatsModalProps) {
  const [localShowModal, setLocalShowModal] = useState(isShowing);
  const inTransaction = useTransactions().transactions.some((tx) => !tx.receipt);

  const handleOnHide = useCallback(() => {
    if (!inTransaction) {
      setLocalShowModal(false);
      setTimeout(() => onHide(), 150);
    }
  }, [inTransaction, onHide]);

  const escapeHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && !inTransaction) handleOnHide();
    },
    [inTransaction, handleOnHide]
  );

  useEffect(() => {
    window.addEventListener("keydown", escapeHandler);
    return () => window.removeEventListener("keydown", escapeHandler);
  }, [escapeHandler]);

  useEffect(() => setLocalShowModal(isShowing), [isShowing]);

  return isShowing
    ? ReactDOM.createPortal(
        <StyledModal isShowing={localShowModal}>
          <div className="overlay" onClick={handleOnHide} />
          <ModalContainer
            withIcon={!!titleIcon}
            withTitleDivider={withTitleDivider}
            removeHorizontalPadding={removeHorizontalPadding}
            capitalizeTitle={capitalizeTitle}>
            <div className="header">
              <div className="title">
                {titleIcon && typeof titleIcon === "string" ? <img src={titleIcon} alt="icon" /> : titleIcon}
                <span>{title && <span>{title}</span>}</span>
              </div>
              <button disabled={inTransaction} type="button" className="close" onClick={handleOnHide}>
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
