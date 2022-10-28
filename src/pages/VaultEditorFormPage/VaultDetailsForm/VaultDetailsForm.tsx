import { useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { FormInput, FormIconInput } from "components";
import { IEditedVaultDescription } from "../types";
import { StyledVaultDetails } from "./styles";

export function VaultDetailsForm() {
  const { t } = useTranslation();
  const { register, control, resetField, setValue } = useEnhancedFormContext<IEditedVaultDescription>();

  const startDate = useWatch({ control, name: "project-metadata.starttime" });
  const endDate = useWatch({ control, name: "project-metadata.endtime" });

  const datesAreSelected = !!(startDate || endDate);
  const [showDatesInputs, setShowDatesInputs] = useState<boolean>(datesAreSelected);

  const handleAddDatesChange = (e) => {
    const newValue = e.target.checked;

    if (newValue) {
      resetField("project-metadata.starttime");
      resetField("project-metadata.endtime");
    } else {
      setValue("project-metadata.starttime", undefined);
      setValue("project-metadata.endtime", undefined);
    }

    setShowDatesInputs(newValue);
  };

  return (
    <StyledVaultDetails>
      <div className="sub-container">
        <div className="inputs">
          <FormInput
            {...register("project-metadata.name")}
            label={t("VaultEditor.vault-details.name")}
            colorable
            placeholder={t("VaultEditor.vault-details.name-placeholder")}
          />
          <FormInput
            {...register("project-metadata.type")}
            colorable
            placeholder={t("VaultEditor.vault-details.type-placeholder")}
            label={t("VaultEditor.vault-details.type")}
          />
          <FormInput
            {...register("project-metadata.website")}
            colorable
            placeholder={t("VaultEditor.vault-details.website-placeholder")}
            label={t("VaultEditor.vault-details.website")}
          />
        </div>

        <div className="icons">
          <div className="icons__input">
            <FormIconInput {...register("project-metadata.icon")} colorable label={t("VaultEditor.vault-details.icon")} />
          </div>
          <div className="icons__input">
            <FormIconInput
              {...register("project-metadata.tokenIcon")}
              colorable
              label={t("VaultEditor.vault-details.token-icon")}
            />
          </div>
        </div>
      </div>

      <FormInput
        checked={showDatesInputs}
        onChange={handleAddDatesChange}
        name="start-end-dates"
        type="checkbox"
        label={t("VaultEditor.addStartAndEndDate")}
      />

      {showDatesInputs && (
        <div className="dates-container">
          <FormInput
            {...register("project-metadata.starttime")}
            label={t("VaultEditor.vault-details.starttime")}
            colorable
            placeholder={t("VaultEditor.vault-details.starttime-placeholder")}
          />
          <FormInput
            {...register("project-metadata.endtime")}
            label={t("VaultEditor.vault-details.endtime")}
            colorable
            placeholder={t("VaultEditor.vault-details.endtime-placeholder")}
          />
        </div>
      )}
    </StyledVaultDetails>
  );
}
