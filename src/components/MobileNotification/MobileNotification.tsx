import React from "react";
import "./MobileNotification.scss";
import Logo from "../../assets/icons/logo.icon";
import { HATS_WEBSITE } from "../../constants/constants";

export default function MobileNotification() {
  return (
    <div className="mobile-notification-wrapper">
      <Logo />
      <span>Mobile version coming soon. Meanwhile, check out our site.</span>
      <button onClick={() => window.open(HATS_WEBSITE, '_blank')}>Go to site</button>
    </div>
  )
}
