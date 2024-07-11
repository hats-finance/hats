import {
  IEditedVaultDescription,
  IEditedVulnerabilitySeverity,
  createNewCoveredContract,
  getDefaultVaultParameters,
  getVulnerabilitySeveritiesTemplate,
} from "@hats.finance/shared";
import { FormDateInput, FormIconInput, FormInput, FormSelectInput } from "components";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/form";
import { useOnChange } from "hooks/usePrevious";
import moment from "moment";
import { useContext, useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VaultEditorFormContext } from "../../store";
import { VaultAssetsList } from "../shared/VaultAssetsList/VaultAssetsList";
import { VaultEmailsForm } from "../shared/VaultEmailsList/VaultEmailsList";
import { WhitelistedAddressesList } from "../shared/WhitelistedAddressesList/WhitelistedAddressesList";
import { StyledVaultDetails } from "./styles";

export function VaultDetailsForm() {
  const { t } = useTranslation();
  const { allFormDisabled, isAdvancedMode, isEditingExistingVault } = useContext(VaultEditorFormContext);

  const { register, control, resetField, setValue, getValues, watch, trigger } =
    useEnhancedFormContext<IEditedVaultDescription>();

  const showDateInputs = useWatch({ control, name: "includesStartAndEndTime" });
  const vaultType = useWatch({ control, name: "project-metadata.type" });
  const isPrivateAudit = useWatch({ control, name: "project-metadata.isPrivateAudit" });
  const isContinuousAudit = useWatch({ control, name: "project-metadata.isContinuousAudit" });

  useEffect(() => {
    if (isContinuousAudit) return setValue("project-metadata.isPrivateAudit", false);
  }, [isContinuousAudit, setValue]);

  useEffect(() => {
    if (isPrivateAudit) return setValue("project-metadata.isContinuousAudit", false);
  }, [isPrivateAudit, setValue]);

  const vaultTypes = [
    { label: t("bugBountyProgram"), value: "normal" },
    { label: t("auditCompetition"), value: "audit" },
    { label: t("aiSafety"), value: "audit" },
    // { label: t("grant"), value: "grants" },
  ];

  // Change the start and end time if the showDateInputs property changes
  useEffect(() => {
    if (showDateInputs) {
      resetField("project-metadata.starttime");
      resetField("project-metadata.endtime");
    } else {
      setValue("project-metadata.starttime", undefined);
      setValue("project-metadata.endtime", undefined);
    }
  }, [showDateInputs, setValue, resetField]);

  // Show the start and end time if the vault type is audit or grants
  useEffect(() => {
    const data = getValues();
    if (!data["project-metadata"]) return;

    const { starttime, endtime } = data["project-metadata"];

    if (starttime || endtime) return;

    // Set includesStartAndEndTime property
    if (vaultType === "audit" || vaultType === "grants") setValue("includesStartAndEndTime", true);
    else setValue("includesStartAndEndTime", false);
  }, [vaultType, getValues, setValue]);

  // Change the vulnerability template and default on-chain params if the vault type changes
  useOnChange(vaultType, (_, prevVal) => {
    if (prevVal === undefined) return;

    const isAudit = vaultType === "audit";

    const data = getValues();
    const vulnerabilitySeveritiesTemplate = getVulnerabilitySeveritiesTemplate(data.version, isAudit);
    const defaultOnChainParams = getDefaultVaultParameters(isAudit, data.version);

    const severitiesIds = vulnerabilitySeveritiesTemplate.severities.map((s) => s.id as string);
    const severitiesOptionsForContractsCovered = vulnerabilitySeveritiesTemplate.severities.map(
      (s: IEditedVulnerabilitySeverity) => ({
        label: s.name,
        value: s.id as string,
      })
    );

    setValue("vulnerability-severities-spec", vulnerabilitySeveritiesTemplate);
    if (isAudit) setValue("contracts-covered", []);
    else setValue("contracts-covered", [{ ...createNewCoveredContract(severitiesIds) }]);
    setValue("severitiesOptions", severitiesOptionsForContractsCovered);
    setValue("parameters", defaultOnChainParams);

    // Change the `usingPointingSystem` value
    if (isAudit) setValue("usingPointingSystem", true);
    else setValue("usingPointingSystem", false);
    trigger("vulnerability-severities-spec");
  });

  return (
    <StyledVaultDetails>
      <div className="sub-container">
        <div className="inputs">
          <FormInput
            {...register("project-metadata.name")}
            label={t("VaultEditor.vault-details.name")}
            colorable
            disabled={(isEditingExistingVault && vaultType === "audit") || allFormDisabled}
            placeholder={t("VaultEditor.vault-details.name-placeholder")}
            flexExpand
          />
          <Controller
            control={control}
            name={`project-metadata.type`}
            render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
              <FormSelectInput
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={error}
                label={t("VaultEditor.vault-details.type")}
                placeholder={t("VaultEditor.vault-details.type-placeholder")}
                colorable
                disabled={isEditingExistingVault || allFormDisabled}
                options={vaultTypes}
                {...field}
                value={field.value ?? ""}
                flexExpand
              />
            )}
          />
          <div className="toggles">
            {(vaultType === "audit" && isAdvancedMode) || isPrivateAudit ? (
              <FormInput
                {...register("project-metadata.isPrivateAudit")}
                noMargin
                disabled={isEditingExistingVault || allFormDisabled}
                type="toggle"
                label={t("isPrivateQuestion")}
              />
            ) : null}
            {(vaultType === "audit" && isAdvancedMode) || isContinuousAudit ? (
              <FormInput
                {...register("project-metadata.isContinuousAudit")}
                noMargin
                disabled={isEditingExistingVault || allFormDisabled}
                type="toggle"
                label={t("isContinuousAuditQuestion")}
              />
            ) : null}
          </div>
        </div>

        <div className="inputs col-sm">
          <FormInput
            {...register("project-metadata.website")}
            colorable
            disabled={allFormDisabled}
            placeholder={t("VaultEditor.vault-details.website-placeholder")}
            label={t("VaultEditor.vault-details.website")}
          />

          <div className="icons">
            <FormIconInput
              {...register("project-metadata.icon")}
              disabled={allFormDisabled}
              colorable
              label={t("VaultEditor.vault-details.icon")}
            />
          </div>
        </div>

        <p className="mb-3 helper-text">{t("VaultEditor.vault-details.oneLinerExplanation")}</p>
        <FormInput
          {...register("project-metadata.oneLiner")}
          colorable
          disabled={allFormDisabled}
          placeholder={t("VaultEditor.vault-details.oneLiner-placeholder")}
          label={t("VaultEditor.vault-details.oneLiner")}
          helper={watch("project-metadata.oneLiner") ? `${watch("project-metadata.oneLiner")?.length ?? 0} characters` : ""}
        />
      </div>

      {isPrivateAudit && (
        <>
          <p className="section-title mt-5">{t("VaultEditor.vault-details.whitelistedAddreses")}</p>
          <p className="mb-3 helper-text">{t("VaultEditor.vault-details.whitelistedAddresesExplanation")}</p>
          <WhitelistedAddressesList />
        </>
      )}

      {!isEditingExistingVault && (
        <>
          <p className="section-title mt-5">{t("communicationChannel")}</p>
          <p className="mb-3 helper-text">{t("VaultEditor.vault-details.communicationChannelExplanation")}</p>
          <VaultEmailsForm />
        </>
      )}

      {!isEditingExistingVault && (
        <div className="mt-5">
          <VaultAssetsList />
        </div>
      )}

      {vaultType === "audit" && (
        <>
          <p className="mb-3 helper-text">{t("VaultEditor.vault-details.intendedAmountExplanation")}</p>
          <div className="w-50">
            <FormInput
              {...register("project-metadata.intendedCompetitionAmount")}
              type="number"
              label={t("VaultEditor.vault-details.intendedCompetitionAmount")}
              colorable
              disabled={allFormDisabled}
              placeholder={t("VaultEditor.vault-details.intendedCompetitionAmount-placeholder")}
            />
          </div>
        </>
      )}

      <br />

      {((vaultType !== "audit" && isAdvancedMode) || vaultType === "audit") && (
        <>
          <p className="section-title">{t("startAndEndDate")}</p>
          <div className="helper-text mb-3">{t("VaultEditor.vault-details.startEndDateExplanation")}</div>
        </>
      )}

      {vaultType !== "audit" && isAdvancedMode ? (
        <FormInput
          {...register("includesStartAndEndTime")}
          disabled={allFormDisabled}
          type="toggle"
          label={t("VaultEditor.addStartAndEndDate")}
        />
      ) : null}

      {showDateInputs && (
        <div className="inputs">
          <Controller
            control={control}
            name={`project-metadata.starttime`}
            render={({ field, fieldState: { error }, formState: { defaultValues, dirtyFields } }) => (
              <FormDateInput
                withTime
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={error}
                label={t("VaultEditor.vault-details.starttime")}
                placeholder={t("VaultEditor.vault-details.starttime-placeholder")}
                colorable
                disabled={allFormDisabled}
                helper={t("dateIsInGMT", { timezone: moment().format("Z") })}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name={`project-metadata.endtime`}
            render={({ field, fieldState: { error }, formState: { defaultValues, dirtyFields } }) => (
              <FormDateInput
                withTime
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={error}
                label={t("VaultEditor.vault-details.endtime")}
                placeholder={t("VaultEditor.vault-details.endtime-placeholder")}
                colorable
                disabled={allFormDisabled}
                helper={t("dateIsInGMT", { timezone: moment().format("Z") })}
                {...field}
              />
            )}
          />
        </div>
      )}
    </StyledVaultDetails>
  );
}
