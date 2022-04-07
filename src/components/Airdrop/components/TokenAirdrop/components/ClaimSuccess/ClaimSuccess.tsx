import { t } from "i18next";
import { SocialLinks } from "constants/constants";
import DiscordIcon from "assets/icons/social/discord.icon";
import TwitterIcon from "assets/icons/social/twitter.icon";
import "./index.scss";
import { formatWei } from "utils";

interface IProps {
  tokenAmount: number
  backToAirdrop: () => void
}

export default function ClaimSuccess({ tokenAmount, backToAirdrop }: IProps) {
  // &url=${encodeURIComponent(SocialLinks.Twitter)}
  // TODO: check if it's possible to attach an image to the sharing link
  // TODO: add HATs token automatically to MetaMask?
  const twitterShareLink = `https://twitter.com/intent/tweet?text=${t("Airdrop.TokenAirdrop.Success.twitter-share-text")}`;
  return (
    <div className="claim-success-wrapper">
      <h3>{t("Airdrop.TokenAirdrop.Success.title")}</h3>
      <p>{`${t("Airdrop.TokenAirdrop.Success.section-1")} ${formatWei(tokenAmount)} Hats!`}</p>
      <p>{t("Airdrop.TokenAirdrop.Success.section-2")}</p>
      <div className="actions-wrapper">
        <a className="twitter-link" target="_blank" rel="noopener noreferrer" href={twitterShareLink}><TwitterIcon width={35} height={35} /><span>{t("Airdrop.TokenAirdrop.Success.twitter-share")}</span></a>
        <a className="discord-link" target="_blank" rel="noopener noreferrer" href={SocialLinks.Discord}><DiscordIcon width={35} height={35} /><span>{t("Airdrop.TokenAirdrop.Success.join-discord")}</span></a>
      </div>

      <div className="secondary-actions-wrapper">
        <button className="fill" onClick={backToAirdrop}>BACK TO AIRDROP</button>
      </div>
    </div>
  )
}
