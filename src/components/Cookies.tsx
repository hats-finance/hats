import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { COOKIES_POLICY, LocalStorage } from "../constants/constants";
import "../styles/Cookies.scss";

interface IProps {
  setAcceptedCookies: Function;
}

export default function Cookies(props: IProps) {
  const acceptedCookies = () => {
    localStorage.setItem(LocalStorage.Cookies, "1");
    props.setAcceptedCookies("1");
  };

  return (
    <div className="cookies-wrapper" data-testid="Cookies">
      <span>
        This website uses cookies to ensure you the best experience on our
        website
      </span>
      <div className="cookies-links-wrapper">
        <a
          {...defaultAnchorProps}
          className="policy-link"
          href={COOKIES_POLICY}
        >
          Cookies Policy
        </a>
        <button className="accept-button" onClick={acceptedCookies}>
          ACCEPT
        </button>
      </div>
    </div>
  );
}
