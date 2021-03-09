import React from "react";
import "../../styles/Shared/Loading.scss";
import LoadingIcon from "../../assets/icons/loading.svg";

interface IProps {
  fixed?: boolean;
  top?: string; // can be any valid css top value
}

export default function Loading(props: IProps) {
  document.documentElement.style.setProperty("--top", props.top ?? "50%");
  return (
    <div className={props.fixed ? "loading-wrapper fixed" : "loading-wrapper"}>
      <img width='40px' src={LoadingIcon} alt='loader' />
    </div>
  )
}
