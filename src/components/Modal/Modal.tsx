import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ArrowIcon from "assets/icons/arrow.icon";
import { StyledModal, ModalContainer } from "./styles";

interface ModalProps {
  isShowing: boolean;
  onHide?: () => void;
  onBackButton?: () => void | null;
  children: React.ReactElement;
  zIndex?: number;
  title?: string;
  titleIcon?: string | React.ReactElement;
  withTitleDivider?: boolean;
  removeHorizontalPadding?: boolean;
  capitalizeTitle?: boolean;
  disableClose?: boolean;
}

export function Modal({
  isShowing,
  onHide = () => {},
  onBackButton,
  children,
  title,
  titleIcon,
  zIndex = 0,
  disableClose = false,
  withTitleDivider = false,
  removeHorizontalPadding = false,
  capitalizeTitle = false,
}: ModalProps) {
  const [localShowModal, setLocalShowModal] = useState(isShowing);
  // const inTransaction = useTransactions().transactions.some((tx) => !tx.receipt);
  // TODO: [v2] re-implement this functionality (show ongoing transaction)
  const inTransaction = false;

  const handleOnHide = useCallback(() => {
    if (disableClose) return;

    if (!inTransaction) {
      setLocalShowModal(false);
      setTimeout(() => onHide(), 150);
    }
  }, [inTransaction, onHide, disableClose]);

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
        <StyledModal isShowing={localShowModal} zIndex={zIndex}>
          <div className="overlay" onClick={handleOnHide} />
          <ModalContainer
            disableClose={disableClose}
            withIcon={!!titleIcon}
            withTitleDivider={withTitleDivider}
            removeHorizontalPadding={removeHorizontalPadding}
            capitalizeTitle={capitalizeTitle}>
            <div className="header">
              <div className="title">
                {onBackButton && (
                  <div className="back-button" onClick={onBackButton}>
                    <ArrowIcon />
                  </div>
                )}
                {titleIcon && typeof titleIcon === "string" ? <img src={titleIcon} alt="icon" /> : titleIcon}
                <span>{title && <span>{title}</span>}</span>
              </div>
              {!disableClose && (
                <button disabled={inTransaction} type="button" className="close" onClick={handleOnHide}>
                  <span aria-hidden="true">&times;</span>
                </button>
              )}
            </div>
            <div className="content">{children}</div>
          </ModalContainer>
        </StyledModal>,
        document.body
      )
    : null;
}
