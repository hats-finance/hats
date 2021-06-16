import React from "react";
import "../styles/Cookies.scss";

interface IProps {
  setAcceptedCookies: Function
}

export default function Cookies(props: IProps) {

  const acceptedCookies = () => {
    localStorage.setItem("acceptedCookies", "1");
    props.setAcceptedCookies("1");
  };

  return (
    <div className="cookies-wrapper">
      accept cookies
      <button onClick={acceptedCookies}>Accept</button>
    </div>
  )
}
