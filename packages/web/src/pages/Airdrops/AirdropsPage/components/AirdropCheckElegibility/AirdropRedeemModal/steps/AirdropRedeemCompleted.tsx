import { Button } from "components";
import { SocialLinks } from "constants/constants";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { useTranslation } from "react-i18next";

const UTILITY_GUIDE_URL = "https://hatsfinance.medium.com/hats-finance-hat-tokenomics-efe090f98d49";

export const AirdropRedeemCompleted = () => {
  const { t } = useTranslation();

  return (
    <div className="content-modal">
      <img className="banner" src={require("assets/images/hats_vault_open.png")} alt="hats claim" />
      <h2>{t("Airdrop.claimSuccessful")}</h2>

      <div>
        <p>
          <strong>{t("Airdrop.yourTokenHasBeenAddedToYourWallet")}</strong>
        </p>

        <p className="mt-3">
          <strong>{t("Airdrop.whatsNext")}</strong>
        </p>
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
