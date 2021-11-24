import { COOKIES_POLICY } from "../constants/constants";
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
      <div className="cookies-links-wrapper">
        <a className="policy-link" target="_blank" rel="noopener noreferrer" href={COOKIES_POLICY}>Cookies Policy</a>
        <button className="accept-button" onClick={acceptedCookies}>ACCEPT</button>
      </div>
    </div>
  )
}
