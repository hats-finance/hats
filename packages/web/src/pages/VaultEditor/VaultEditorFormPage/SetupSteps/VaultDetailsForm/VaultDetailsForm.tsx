import { useContext, useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { getPath } from "utils/objects.utils";
import { FormInput, FormIconInput, FormDateInput, FormSelectInput } from "components";
import { VaultEmailsForm } from "../shared/VaultEmailsList/VaultEmailsList";
import { IEditedVaultDescription } from "types";
import { VaultEditorFormContext } from "../../store";
import { StyledVaultDetails } from "./styles";

export function VaultDetailsForm() {
  const { t } = useTranslation();
  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const { register, control, resetField, setValue } = useEnhancedFormContext<IEditedVaultDescription>();

  const showDateInputs = useWatch({ control, name: "includesStartAndEndTime" });

  const vaultTypes = [
    { label: t("bugBountyProgram"), value: "normal" },
    { label: t("auditCompetition"), value: "audit" },
    { label: t("grant"), value: "grants" },
  ];

  useEffect(() => {
    if (showDateInputs) {
      resetField("project-metadata.starttime");
      resetField("project-metadata.endtime");
    } else {
      setValue("project-metadata.starttime", undefined);
      setValue("project-metadata.endtime", undefined);
    }
  }, [showDateInputs, setValue, resetField]);

  return (
    <StyledVaultDetails>
      <div className="sub-container">
        <div className="inputs">
          <FormInput
            {...register("project-metadata.name")}
            label={t("VaultEditor.vault-details.name")}
            colorable
            disabled={allFormDisabled}
            placeholder={t("VaultEditor.vault-details.name-placeholder")}
          />
          <Controller
            control={control}
            name={`project-metadata.type`}
            render={({ field, formState: { errors, dirtyFields, defaultValues } }) => (
              <FormSelectInput
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={getPath(errors, field.name)}
                label={t("VaultEditor.vault-details.type")}
                placeholder={t("VaultEditor.vault-details.type-placeholder")}
                colorable
                disabled={allFormDisabled}
                options={vaultTypes}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>

        <VaultEmailsForm />

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
            <FormIconInput
              {...register("project-metadata.tokenIcon")}
              disabled={allFormDisabled}
              colorable
              label={t("VaultEditor.vault-details.token-icon")}
            />
          </div>
        </div>
      </div>

      <br />

      <FormInput
        {...register("includesStartAndEndTime")}
        disabled={allFormDisabled}
        type="checkbox"
        label={t("VaultEditor.addStartAndEndDate")}
      />

      {showDateInputs && (
        <div className="inputs">
          <Controller
            control={control}
            name={`project-metadata.starttime`}
            render={({ field, formState: { errors, defaultValues, dirtyFields } }) => (
              <FormDateInput
                withTime
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={getPath(errors, field.name)}
                label={t("VaultEditor.vault-details.starttime")}
                placeholder={t("VaultEditor.vault-details.starttime-placeholder")}
                colorable
                disabled={allFormDisabled}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name={`project-metadata.endtime`}
            render={({ field, formState: { errors, defaultValues, dirtyFields } }) => (
              <FormDateInput
                withTime
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={getPath(errors, field.name)}
                label={t("VaultEditor.vault-details.endtime")}
                placeholder={t("VaultEditor.vault-details.endtime-placeholder")}
                colorable
                disabled={allFormDisabled}
                {...field}
              />
            )}
          />
        </div>
      )}
    </StyledVaultDetails>
  );
}
