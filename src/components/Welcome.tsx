import React from "react";
import Logo from "../assets/icons/logo.icon";
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
    localStorage.setItem("hasSeenWelcomePage", "1");
    props.setHasSeenWelcomePage("1");
  };

  return (
    <div className="welcome-wrapper">
      <div className="welcome-content">
        <Logo />
        <div className="title">Hatters</div>
        <div className="description">hero is not the opposite of poor</div>
        <button className="enter-btn" onClick={seenWelcomePage}>ENTER</button>
      </div>
    </div>
  )
}
