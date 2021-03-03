import React from "react";
import "../../styles/Shared/Loading.scss";
import LoadingIcon from "../../assets/icons/loading.svg";

interface IProps {
  fixed?: boolean;
}

export default function Loading(props: IProps) {
  return (
    <div className={props.fixed ? "loading-wrapper fixed" : "loading-wrapper"}>
      <img width='40px' src={LoadingIcon} alt='loader' />
    </div>
  )
}
