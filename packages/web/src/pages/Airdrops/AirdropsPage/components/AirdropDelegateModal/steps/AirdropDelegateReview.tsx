import { Button, FormInput } from "components";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AirdropDelegateModalContext } from "../store";

export const AirdropDelegateReview = () => {
  const { t } = useTranslation();
  const { prevStep, selectedDelegatee, isDelegating, handleDelegateAidrop } = useContext(AirdropDelegateModalContext);

  return (
    <div className="content-modal">
      <img className="banner" src={require("assets/images/hats_claim.png")} alt="hats claim" />
      <h2>{t("Airdrop.delegateTokens")}</h2>

      <strong>{t("Airdrop.delegateTokensExplanation")}</strong>

      <div className="mt-4">
        <FormInput label={t("Airdrop.delegatee")} className="mt-2" readOnly value={selectedDelegatee} />
      </div>

      <div className="buttons">
        <Button styleType="outlined" size="medium" onClick={prevStep} disabled={isDelegating}>
          ⬅️
        </Button>
        <Button onClick={handleDelegateAidrop} disabled={!selectedDelegatee} bigHorizontalPadding>
          {t("Airdrop.delegateTokens")}
        </Button>
      </div>
    </div>
  );
};
