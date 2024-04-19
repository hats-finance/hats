import { Button } from "components";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AirdropRedeemModalContext } from "../store";

export const AirdropRedeemStart = () => {
  const { t } = useTranslation();
  const { nextStep } = useContext(AirdropRedeemModalContext);

  return (
    <div className="content-modal">
      <img className="banner" src={require("assets/images/hats_claim.png")} alt="hats claim" />
      <div dangerouslySetInnerHTML={{ __html: t("Airdrop.startTextContent") }} />

      <div className="buttons">
        <Button onClick={nextStep} bigHorizontalPadding>
          {t("Airdrop.startQuiz")}
        </Button>
      </div>
    </div>
  );
};
