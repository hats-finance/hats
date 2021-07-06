import React from "react";
import { Link } from "react-router-dom";
import { RoutePaths } from "../constants/constants";
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
      <span>This website uses cookies to ensure you the best experience on our website</span>
      <div>
        <Link className="policy-link" to={RoutePaths.privacy_policy}>Privacy and cookies policy</Link>
        <button className="accept-button" onClick={acceptedCookies}>ACCEPT</button>
      </div>
    </div>
  )
}
