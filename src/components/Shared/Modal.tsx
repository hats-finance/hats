import React from "react";
import "../../styles/Shared/Modal.scss";

interface IProps {
  title: string,
  children: React.ReactNode,
  setShowModal: (show: boolean) => any
}

export default function Modal(props: IProps) {

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div className="modal-wrapper">
      <div className="modal-content-wrapper">
        <div className="modal-top">
          <div>{props.title}</div>
          <button
            className="close"
            onClick={() => { document.body.style.overflow = "initial"; props.setShowModal(false) }}>&times;</button>
        </div>
        <div className="modal-content">
          {props.children}
        </div>
      </div>
    </div>
  )
}
