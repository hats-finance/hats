import DiscordIcon from "../assets/icons/social/discord.icon";
import "../styles/Gov.scss";
//import moment from "moment";
//import WithdrawCountdown from "./WithdrawCountdown";

export default function Gov() {
  return (
    <div className="content gov-wrapper">
      <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/3kHJFDUs">
        Forum in Discord
        <DiscordIcon />
      </a>
      {/* <WithdrawCountdown endDate={moment(new Date()).add(3,'hours')} /> */}
    </div>
  )
}
