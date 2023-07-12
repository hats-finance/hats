import {
  DefaultIndexArray,
  IPayoutData,
  ISinglePayoutData,
  IVulnerabilitySeverityV1,
  IVulnerabilitySeverityV2,
} from "@hats-finance/shared";
import { FormInput, FormSelectInput } from "components";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/form";
import { useOnChange } from "hooks/usePrevious";
import { useContext } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SinglePayoutAllocation } from "../../../components";
import { PayoutFormContext } from "../../store";
import { StyledPayoutForm } from "../../styles";

export const SinglePayoutForm = () => {
  const { t } = useTranslation();
  const { vault, payout, isPayoutCreated, severitiesOptions } = useContext(PayoutFormContext);

  const methods = useEnhancedFormContext<ISinglePayoutData>();
  const { register, control, setValue } = methods;

  const percentageToPay = useWatch({ control, name: "percentageToPay" });

  const vaultSeverities = vault?.description?.severities ?? [];
  const selectedSeverityName = useWatch({ control, name: "severity", defaultValue: undefined });
  const selectedSeverityIndex = vaultSeverities.findIndex(
    (severity) => severity.name.toLowerCase() === selectedSeverityName?.toLowerCase()
  );
  const selectedSeverityData = selectedSeverityIndex !== -1 ? vaultSeverities[selectedSeverityIndex] : undefined;

  const rewardLevelsV1 = vault?.rewardsLevels ?? DefaultIndexArray;
  const severityBountyIndexOptions = rewardLevelsV1.map((val, idx) => ({
    label: `Index ${idx} => ${val / 100}%`,
    value: idx.toString(),
  }));

  // Edit the payout percentage and NFT info based on the selected severity
  useOnChange(selectedSeverityName, (newSelected, prevSelected) => {
    if (!selectedSeverityData) return;
    if (prevSelected === undefined || newSelected === undefined) return;

    setValue("nftUrl", selectedSeverityData["nft-metadata"].image);

    if (vault?.version === "v2") {
      const maxBounty = vault.maxBounty ? +vault.maxBounty / 100 : 100;
      const percentage = (selectedSeverityData as IVulnerabilitySeverityV2).percentage * (maxBounty / 100);
      setValue("percentageToPay", percentage.toString());
    } else {
      const indexArray = vault?.rewardsLevels ?? DefaultIndexArray;
      setValue("percentageToPay", (+indexArray[(selectedSeverityData as IVulnerabilitySeverityV1).index] / 100).toString());
      setValue("severityBountyIndex", (selectedSeverityData as IVulnerabilitySeverityV1).index.toString());
    }
  });

  // ONLY V1: Edit the payout percentage on severityBountyIndex change
  const severityBountyIndex = useWatch({ control, name: "severityBountyIndex" });
  useOnChange(severityBountyIndex, (newSelected, prevSelected) => {
    if (!severityBountyIndex) return;
    if (prevSelected === undefined || newSelected === undefined) return;

    if (vault?.version === "v1") {
      const indexArray = vault?.rewardsLevels ?? DefaultIndexArray;
      setValue("percentageToPay", (+indexArray[severityBountyIndex] / 100).toString());
    }
  });

  return (
    <StyledPayoutForm>
      <div className="form-container">
        <FormInput
          {...register("title")}
          label={t("Payouts.payoutName")}
          placeholder={t("Payouts.payoutNamePlaceholder")}
          disabled={isPayoutCreated}
          colorable
          className="w-60"
        />

        <FormInput
          {...register("beneficiary")}
          label={t("Payouts.beneficiary")}
          placeholder={t("Payouts.beneficiaryPlaceholder")}
          disabled={isPayoutCreated}
          pastable
          colorable
        />

        <div className="row">
          <Controller
            control={control}
            name={`severity`}
            render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
              <FormSelectInput
                disabled={isPayoutCreated}
                isDirty={getCustomIsDirty<IPayoutData>(field.name, dirtyFields, defaultValues)}
                error={error}
                label={t("severity")}
                placeholder={t("severityPlaceholder")}
                colorable
                options={severitiesOptions ?? []}
                {...field}
              />
            )}
          />

          {vault && vault.version === "v1" && (
            <Controller
              control={control}
              name={`severityBountyIndex`}
              render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
                <FormSelectInput
                  disabled={isPayoutCreated || !selectedSeverityName}
                  isDirty={getCustomIsDirty<IPayoutData>(field.name, dirtyFields, defaultValues)}
                  error={error}
                  label={t("Payouts.percentageToPay")}
                  placeholder={t("Payouts.percentageToPayPlaceholder")}
                  colorable
                  options={severityBountyIndexOptions ?? []}
                  {...field}
                />
              )}
            />
          )}

          {vault && vault.version === "v2" && (
            <FormInput
              {...register("percentageToPay")}
              label={t("Payouts.percentageToPay")}
              placeholder={t("Payouts.percentageToPayPlaceholder")}
              helper={t("Payouts.percentageOfTheTotalVaultToPay")}
              disabled={isPayoutCreated}
              type="number"
              colorable
            />
          )}
        </div>

        <SinglePayoutAllocation
          vault={vault}
          payout={payout}
          percentageToPay={percentageToPay}
          selectedSeverity={selectedSeverityData}
        />
      </div>

      <div className="form-container mt-5">
        <p className="subtitle">{t("Payouts.reasoning")}</p>
        <p className="mt-2">{t("Payouts.reasoningDescription")}</p>
        <p className="mt-2 mb-5 reasoningAlert">
          <span>{t("pleaseNote")}:</span> {t("thisInformationWillAppearOnChain")}
        </p>

        <FormInput
          {...register("explanation")}
          label={t("Payouts.explanation")}
          placeholder={t("Payouts.explanationPlaceholder")}
          disabled={isPayoutCreated}
          type="textarea"
          rows={4}
          colorable
        />

        <p className="mt-2 mb-5">{t("Payouts.additionalDetails")}</p>

        <FormInput
          {...register("additionalInfo")}
          label={t("Payouts.additionalInfo")}
          placeholder={t("Payouts.additionalInfoPlaceholder")}
          disabled={isPayoutCreated}
          type="textarea"
          rows={8}
          colorable
        />
      </div>
    </StyledPayoutForm>
  );
};
