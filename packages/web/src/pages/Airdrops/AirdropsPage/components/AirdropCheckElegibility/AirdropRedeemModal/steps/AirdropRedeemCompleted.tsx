import { Button } from "components";
import moment from "moment";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AirdropRedeemModalContext } from "../store";

export const AirdropRedeemCompleted = () => {
  const { t } = useTranslation();

  const { airdropElegibility } = useContext(AirdropRedeemModalContext);

  if (airdropElegibility === false || !airdropElegibility) return null;

  return (
    <div className="content-modal">
      <img className="banner" src={require("assets/images/hats_vault_open.png")} alt="hats claim" />
      <h2>{t("Airdrop.claimSuccessful")}</h2>

      <div className="mt-5">
        <strong>{t("Airdrop.claimSuccessfulExplanation")}</strong>
        <p>
          {t("Airdrop.linearlyReleasedExplanation", {
            daysLocked: moment(airdropElegibility.info.lockEndDate).fromNow(true),
          })}
        </p>

        <strong>{t("Airdrop.whatsNext")}</strong>
        <div dangerouslySetInnerHTML={{ __html: t("Airdrop.whatsNextContent") }} />
      </div>

      <div className="buttons">
        <Button styleType="outlined">{t("Airdrop.followHatsOnX")}</Button>
        <Button>{t("Airdrop.readHATUtilityGuide")}</Button>
      </div>
    </div>
  );
};
