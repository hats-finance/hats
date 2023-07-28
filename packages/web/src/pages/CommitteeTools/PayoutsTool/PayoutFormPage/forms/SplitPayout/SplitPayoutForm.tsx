import { ISplitPayoutData } from "@hats-finance/shared";
import { FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SplitPayoutAllocation } from "../../../components";
import { PayoutFormContext } from "../../store";
import { StyledPayoutForm } from "../../styles";

export const SplitPayoutForm = () => {
  const { t } = useTranslation();
  const { vault, isPayoutCreated } = useContext(PayoutFormContext);

  const splitAllocationRef = useRef<any>(null);

  const methods = useEnhancedFormContext<ISplitPayoutData>();
  const { register } = methods;

  return (
    <StyledPayoutForm>
      <div className="form-container">
        <div className="sub-container">
          <p className="subtitle mb-5">{t("Payouts.payoutDetails")}</p>

          <FormInput
            {...register("title")}
            label={t("Payouts.payoutName")}
            placeholder={t("Payouts.payoutNamePlaceholder")}
            disabled={isPayoutCreated}
            colorable
            className="w-60"
          />

          <p className="mt-3 mb-2" ref={splitAllocationRef}>
            {t("Payouts.percentageToPayExplanation", { maxBounty: `${Number(vault?.maxBounty) / 100 ?? 100}%` })}
          </p>

          <FormInput
            {...register("percentageToPay")}
            label={t("Payouts.percentageToPay")}
            placeholder={t("Payouts.percentageToPayPlaceholder")}
            helper={t("Payouts.percentageOfTheTotalVaultToPay")}
            disabled={isPayoutCreated}
            type="number"
            colorable
            className="w-40"
          />
        </div>

        <p className="mt-5">{t("Payouts.editPayoutOfEachBeneficiary")}</p>

        <SplitPayoutAllocation />
      </div>
    </StyledPayoutForm>
  );
};
