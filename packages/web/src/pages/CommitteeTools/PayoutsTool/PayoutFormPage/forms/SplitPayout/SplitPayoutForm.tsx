import { ISplitPayoutData, IVulnerabilitySeverityV2 } from "@hats-finance/shared";
import { Alert, FormInput, Pill } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import { hasSubmissionData } from "../../../utils/hasSubmissionData";
import { useContext, useEffect, useRef } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SplitPayoutAllocation } from "../../../components";
import { PayoutFormContext } from "../../store";
import { StyledPayoutForm } from "../../styles";
import { autocalculateMultiPayout } from "../../../utils/autocalculateMultiPayout";

export const SplitPayoutForm = () => {
  const { t } = useTranslation();
  const { vault, isPayoutCreated, payout } = useContext(PayoutFormContext);

  const severityColors = getSeveritiesColorsArray(vault);
  const isFromSubmissions = hasSubmissionData(payout);
  const splitAllocationRef = useRef<any>(null);

  const methods = useEnhancedFormContext<ISplitPayoutData>();
  const { control, register, setValue, getValues, formState } = methods;
  console.log(formState.errors);

  const { fields } = useFieldArray({ name: "rewardsConstraints", control });
  const watchConstraints = useWatch({ control, name: `rewardsConstraints`, defaultValue: [] });
  const rewardsConstraints = fields.map((field, index) => {
    return {
      ...field,
      ...watchConstraints![index],
    };
  });

  useEffect(() => {
    if (!vault || !vault.description || !payout) return;

    const severities = vault.description.severities;
    const constraints = (payout?.payoutData as ISplitPayoutData).rewardsConstraints ?? [];

    for (const severity of severities) {
      if (constraints.find((constraint) => constraint.severity === severity.name.toLowerCase())) continue;

      constraints.push({
        severity: severity.name.toLowerCase(),
        capAmount: "",
        maxReward: (severity as IVulnerabilitySeverityV2).percentage.toString(),
      });
    }

    setValue("rewardsConstraints", constraints);
  }, [vault, payout, setValue]);

  const autocalculate = () => {
    if (!rewardsConstraints) return;
    if (!vault || !vault.amountsInfo) return;

    const beneficiaries = getValues("beneficiaries");

    const calcs = autocalculateMultiPayout(beneficiaries, rewardsConstraints, vault.amountsInfo.depositedAmount.tokens);
    if (!calcs) return;

    for (const [index, beneficiary] of calcs.beneficiariesCalculated.entries()) {
      setValue(`beneficiaries.${index}.percentageOfPayout`, beneficiary.percentageOfPayout);
    }
    setValue(`percentageToPay`, calcs.totalPercentageToPay.toString());
  };

  return (
    <StyledPayoutForm>
      <button onClick={autocalculate}>calc</button>
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
            {rewardsConstraints.map((constraint, index) => (
              <div className="item" key={index}>
                <div className="pill">
                  <Pill textColor={severityColors[index]} isSeverity text={constraint.severity} />
                </div>
                <FormInput
                  {...register(`rewardsConstraints.${index}.maxReward`)}
                  className="input"
                  label={t("VaultEditor.percentage-bounty")}
                  placeholder={t("VaultEditor.percentage-bounty")}
                  type="number"
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
            ))}

            {
              formState?.errors?.rewardsConstraints && (formState.errors.rewardsConstraints as any[]).some((error) => error?.maxReward?.type === 'sumShouldBe100') && (
                <Alert className="mb-4" type="error">{t('Payouts.severityRewardsSumShouldBe100')}</Alert>
              )
            }
          </div>
        </div>

        <p className="mt-5">{t("Payouts.editPayoutOfEachBeneficiary")}</p>

        <SplitPayoutAllocation />
      </div>
    </StyledPayoutForm>
  );
};
