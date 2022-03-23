import { t } from "i18next";
import { SocialLinks } from "constants/constants";
import DiscordIcon from "assets/icons/social/discord.icon";
import TwitterIcon from "assets/icons/social/twitter.icon";
import "./index.scss";

interface IProps {
  tokenAmount: number
  backToAirdrop: () => void
}

export default function ClaimSuccess({ tokenAmount, backToAirdrop }: IProps) {
  const twitterShareText = "Checkout HATS on twitter!";
  const twitterShareLink = `https://twitter.com/intent/tweet?text=${twitterShareText}&url=${encodeURIComponent(SocialLinks.Twitter)}`;
  return (
    <div className="claim-success-wrapper">
      <h3>{t("Airdrop.TokenAirdrop.Success.title")}</h3>
      <p>{`${t("Airdrop.TokenAirdrop.Success.section-1")} ${tokenAmount} Hats!`}</p>
      <p>{t("Airdrop.TokenAirdrop.Success.section-2")}</p>
      <div className="actions-wrapper">
        <a className="twitter-link" target="_blank" rel="noopener noreferrer" href={twitterShareLink}><span>{t("Airdrop.TokenAirdrop.Success.twitter-share")}</span><TwitterIcon width={35} height={35} /></a>
        <a className="discord-link" target="_blank" rel="noopener noreferrer" href={SocialLinks.Discord}><span>{t("Airdrop.TokenAirdrop.Success.join-discord")}</span><DiscordIcon width={35} height={35} /></a>
      </div>

      <div className="secondary-actions-wrapper">
        <button className="fill" onClick={backToAirdrop}>BACK TO AIRDROP</button>
      </div>
    </div>
  )
}
