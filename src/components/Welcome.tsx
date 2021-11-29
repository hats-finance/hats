import React from "react";
import Logo from "../assets/icons/logo.icon";
import { LocalStorage } from "../constants/constants";
import "../styles/Welcome.scss";

interface IProps {
  setHasSeenWelcomePage: Function
}

export default function Welcome(props: IProps) {

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "initial";
    }
  }, []);

  const seenWelcomePage = () => {
    localStorage.setItem(LocalStorage.WelcomePage, "1");
    props.setHasSeenWelcomePage("1");
  };

  return (
    <div className="welcome-wrapper">
      <div className="welcome-content">
        <Logo />
        <div className="title">Hats</div>
        <div className="description">
          We are changing the way security works to fit the culture, nature, and de-facto development processes of Ethereum by incentivizing black hat to become white hat hackers.
        </div>
        <button className="enter-btn" onClick={seenWelcomePage}>ENTER</button>
      </div>
    </div>
  )
}
