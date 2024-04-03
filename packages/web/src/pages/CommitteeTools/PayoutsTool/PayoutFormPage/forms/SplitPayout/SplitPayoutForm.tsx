import { ISplitPayoutData, IVulnerabilitySeverityV2, IVulnerabilitySeverityV3 } from "@hats.finance/shared";
import { Alert, Button, FormInput, Pill } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import { useOnChange } from "hooks/usePrevious";
import { useCallback, useContext, useEffect, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SplitPayoutAllocation } from "../../../components";
import {
  IPayoutAutoCalcs,
  autocalculateMultiPayout,
  autocalculateMultiPayoutPointingSystem,
} from "../../../utils/autocalculateMultiPayout";
import { PayoutFormContext } from "../../store";
import { StyledPayoutForm } from "../../styles";

export const SplitPayoutForm = () => {
  const { t } = useTranslation();
  const { vault, isPayoutCreated, payout } = useContext(PayoutFormContext);

  const severityColors = getSeveritiesColorsArray(vault);
  const [editSeverityRewards, setEditSeverityRewards] = useState(false);

  const methods = useEnhancedFormContext<ISplitPayoutData>();
  const { control, register, setValue, getValues, formState, trigger } = methods;

  const { fields } = useFieldArray({ name: "rewardsConstraints", control });
  const usingPointingSystem = useWatch({ control, name: `usingPointingSystem`, defaultValue: false });
  const percentageCapPerPoint = useWatch({ control, name: `percentageCapPerPoint` });
  const watchConstraints = useWatch({ control, name: `rewardsConstraints`, defaultValue: [] });
  const rewardsConstraints = fields.map((field, index) => {
    return {
      ...field,
      ...watchConstraints![index],
    };
  });

  useEffect(() => {
    trigger("rewardsConstraints");
  }, [watchConstraints, trigger]);

  const watchBeneficiaries = useWatch({ control, name: `beneficiaries`, defaultValue: [] });
  const watchedSeverities = useWatch({
    control,
    name: watchBeneficiaries.map((_, idx) => `beneficiaries.${idx}.severity` as any),
  });
  const watchedPoints = useWatch({
    control,
    name: watchBeneficiaries.map((_, idx) => `beneficiaries.${idx}.percentageOfPayout` as any),
  });

  const triggerAutocalculate = useCallback(() => {
    if (!watchConstraints) return;
    if (!vault || !vault.amountsInfo) return;

    const beneficiaries = getValues("beneficiaries");

    let calcs: IPayoutAutoCalcs | undefined;
    if (usingPointingSystem) {
      calcs = autocalculateMultiPayoutPointingSystem(
        beneficiaries,
        watchConstraints,
        vault.amountsInfo.depositedAmount.tokens,
        percentageCapPerPoint ? +percentageCapPerPoint : 1
      );
    } else {
      calcs = autocalculateMultiPayout(beneficiaries, watchConstraints, vault.amountsInfo.depositedAmount.tokens);
    }

    if (!calcs) return;

    for (const [index, beneficiary] of calcs.beneficiariesCalculated.entries()) {
      setValue<any>(`beneficiaries.${index}.percentageOfPayout`, beneficiary.percentageOfPayout, { shouldValidate: true });
    }

    setValue<any>(`percentageToPay`, calcs.totalPercentageToPay.toString(), { shouldValidate: true });
    if (calcs.paymentPerPoint) setValue<any>(`paymentPerPoint`, calcs.paymentPerPoint.toString(), { shouldValidate: true });
  }, [usingPointingSystem, percentageCapPerPoint, getValues, setValue, watchConstraints, vault]);

  const stopAutocalculation = useWatch({ control, name: `stopAutocalculation` });

  // If constraints or severities changed, autocalculate
  useEffect(() => {
    if (isPayoutCreated || stopAutocalculation) return;
    triggerAutocalculate();
  }, [watchConstraints, watchedSeverities, triggerAutocalculate, isPayoutCreated, stopAutocalculation]);

  // If points changes, autocalculate
  useOnChange(watchedPoints, (val, prev) => {
    if (JSON.stringify(val) === JSON.stringify(prev)) return;
    if (isPayoutCreated || stopAutocalculation || !usingPointingSystem) return;
    triggerAutocalculate();
  });

  // Populate constraints
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
        points: (severity as IVulnerabilitySeverityV2).points,
      });
    }

    if (usingPointingSystem && vault.version === "v2") {
      const sevToUse = (severities as IVulnerabilitySeverityV2[]).find((sev) => !!sev.percentageCapPerPoint);
      const maxCapPerPointToUse = sevToUse?.percentageCapPerPoint ?? 1;
      setValue<any>("percentageCapPerPoint", `${maxCapPerPointToUse}`);
    } else if (usingPointingSystem && vault.version === "v3") {
      const sevToUse = (severities as IVulnerabilitySeverityV3[]).find((sev) => !!sev.percentageCapPerPoint);
      const maxCapPerPointToUse = sevToUse?.percentageCapPerPoint ?? 1;
      setValue<any>("percentageCapPerPoint", `${maxCapPerPointToUse}`);
    }

    setTimeout(() => setValue<any>("rewardsConstraints", constraints), 500);
  }, [usingPointingSystem, vault, payout, setValue]);

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

          {/* {!isFromSubmissions && (
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
          )} */}

          {usingPointingSystem && (
            <FormInput
              {...register(`percentageCapPerPoint`)}
              className="input"
              label={t("Payouts.maxPercentagePerPoint")}
              placeholder={t("Payouts.maxPercentagePerPointPlaceholder", { token: vault?.stakingTokenSymbol })}
              disabled={isPayoutCreated}
              type="number"
              colorable
            />
          )}

          {/* Reward constraints */}
          {!usingPointingSystem && (
            <>
              <br />
              <p className="subtitle mb-2">{t("Payouts.rewardsConstraints")}</p>
              <div className="rewards-constraints">
                <Button onClick={() => setEditSeverityRewards((prev) => !prev)} styleType="text" className="mb-2" noPadding>
                  {t("Payouts.editSeverityRewards")}
                </Button>
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
                      disabled={isPayoutCreated || !editSeverityRewards}
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

                {formState?.errors?.rewardsConstraints &&
                  (formState.errors.rewardsConstraints as any[]).some((error) => error?.maxReward?.type === "sumShouldBe100") && (
                    <Alert className="mb-2" type="error">
                      {t("Payouts.severityRewardsSumShouldBe100")}
                    </Alert>
                  )}
              </div>
            </>
          )}
        </div>

        <p className="mt-5 mb-4">{t("Payouts.editPayoutOfEachBeneficiary")}</p>
        {!isPayoutCreated && (
          <FormInput
            {...register(`stopAutocalculation`)}
            label={t("Payouts.stopAutocalculation")}
            type="toggle"
            colorable
            noMargin
            disabled={isPayoutCreated}
          />
        )}
        <SplitPayoutAllocation />
      </div>
    </StyledPayoutForm>
  );
};
