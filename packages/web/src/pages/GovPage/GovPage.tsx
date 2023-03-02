import DiscordIcon from "assets/icons/social/discord.icon";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { GOV_DISCORD_LINK } from "constants/constants";
import { StyledGovPage } from "./styles";

const GovPage = () => {
  return (
    <StyledGovPage className="content-wrapper">
      <a {...defaultAnchorProps} href={GOV_DISCORD_LINK}>
        Forum in Discord&nbsp; <DiscordIcon />
      </a>
    </StyledGovPage>
  );
}

export { GovPage };