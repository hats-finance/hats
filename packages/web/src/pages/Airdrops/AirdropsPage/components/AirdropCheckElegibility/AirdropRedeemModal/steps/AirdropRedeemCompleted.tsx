import { Button } from "components";
import { SocialLinks } from "constants/constants";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { useTranslation } from "react-i18next";

const UTILITY_GUIDE_URL = "#";

export const AirdropRedeemCompleted = () => {
  const { t } = useTranslation();

  return (
    <div className="content-modal">
      <img className="banner" src={require("assets/images/hats_vault_open.png")} alt="hats claim" />
      <h2>{t("Airdrop.claimSuccessful")}</h2>

      <div className="mt-5">
        <strong>{t("Airdrop.claimSuccessfulExplanation")}</strong>
        {/* <p className="mb-4 mt-2">
          {t("Airdrop.linearlyReleasedExplanation", {
            daysLocked: moment(airdropData.lockEndDate).fromNow(true),
          })}
        </p> */}

        <strong>{t("Airdrop.whatsNext")}</strong>
        <div dangerouslySetInnerHTML={{ __html: t("Airdrop.whatsNextContent") }} />
      </div>

      <div className="buttons">
        <Button styleType="outlined">
          <a href={SocialLinks.Twitter} {...defaultAnchorProps}>
            {t("Airdrop.followHatsOnX")}
          </a>
        </Button>
        <Button>
          <a href={UTILITY_GUIDE_URL} {...defaultAnchorProps}>
            {t("Airdrop.readHATUtilityGuide")}
          </a>
        </Button>
      </div>
    </div>
  );
};
