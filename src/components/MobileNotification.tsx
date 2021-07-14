import React from "react";
import "../styles/MobileNotification.scss";
import Logo from "../assets/icons/logo.icon";

export default function MobileNotification() {
  return (
    <div className="mobile-notification-wrapper">
      <Logo />
      <span>Currently only desktop version is supported. We apologize for the inconvenience.</span>
    </div>
  )
}
