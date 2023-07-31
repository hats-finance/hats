import { ISplitPayoutData, IVulnerabilitySeverityV2 } from "@hats-finance/shared";
import { FormInput, Pill } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import { hasSubmissionData } from "pages/CommitteeTools/PayoutsTool/utils/hasSubmissionData";
import { useContext, useEffect, useRef } from "react";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SplitPayoutAllocation } from "../../../components";
import { PayoutFormContext } from "../../store";
import { StyledPayoutForm } from "../../styles";

export const SplitPayoutForm = () => {
  const { t } = useTranslation();
  const { vault, isPayoutCreated, payout } = useContext(PayoutFormContext);

  const severityColors = getSeveritiesColorsArray(vault);
  const isFromSubmissions = hasSubmissionData(payout);
  const splitAllocationRef = useRef<any>(null);

  const methods = useEnhancedFormContext<ISplitPayoutData>();
  const { control, register, setValue, getValues } = methods;

  const { fields: rewardsConstraints } = useFieldArray({ name: "rewardsConstraints", control });

  useEffect(() => {
    if (!vault || !vault.description || !payout) return;

    const severities = vault.description.severities;
    const constraints = (payout?.payoutData as ISplitPayoutData).rewardsConstraints ?? [];

    for (const severity of severities) {
      if (constraints.find((constraint) => constraint.severity === severity.name.toLowerCase())) continue;

      constraints.push({
        severity: severity.name.toLowerCase(),
        capAmount: "",
      });
    }

    setValue("rewardsConstraints", constraints);
  }, [vault, payout, setValue]);

  console.log(getValues());

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

          {!isFromSubmissions && (
            <>
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
            </>
          )}

          {/* Reward constraints */}
          <br />
          <p className="subtitle mb-5">{t("Payouts.rewardsConstraints")}</p>
          <div className="rewards-constraints">
            {rewardsConstraints.map((constraint, index) => {
              if (!vault || !vault.description) return null;

              const vaultSeverity = (vault.description.severities as IVulnerabilitySeverityV2[]).find(
                (sev) => sev.name.toLowerCase() === constraint.severity
              );

              return (
                <div className="item">
                  <div className="pill">
                    <Pill textColor={severityColors[index]} isSeverity text={constraint.severity} />
                  </div>
                  <FormInput
                    className="input"
                    value={`${vaultSeverity?.percentage}%`}
                    label={t("VaultEditor.percentage-bounty")}
                    disabled
                    colorable
                  />
                  <FormInput
                    {...register(`rewardsConstraints.${index}.capAmount`)}
                    className="input"
                    label={t("Payouts.maxRewardPerBeneficiary")}
                    placeholder={t("Payouts.maxRewardPerBeneficiaryPlaceholder", { token: vault?.stakingTokenSymbol })}
                    disabled={isPayoutCreated}
                    type="number"
                    colorable
                  />
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-5">{t("Payouts.editPayoutOfEachBeneficiary")}</p>

        <SplitPayoutAllocation />
      </div>
    </StyledPayoutForm>
  );
};
