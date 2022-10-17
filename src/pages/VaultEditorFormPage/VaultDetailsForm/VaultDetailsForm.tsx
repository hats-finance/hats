import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormInput, FormIconInput } from "components";
import { IEditedVaultDescription } from "../types";
import { StyledVaultDetails } from "./styles";
import useEnhancedFormContext from "hooks/useEnhancedFormContext";

export function VaultDetailsForm() {
  const { t } = useTranslation();
  const { register, formState, getFieldState } = useEnhancedFormContext<IEditedVaultDescription>();

  return (
    <StyledVaultDetails>
      <div className="inputs">
        <FormInput
          {...register("project-metadata.name")}
          // isDirty={getFieldState("project-metadata.name", formState).isDirty}
          label={t("VaultEditor.vault-details.name")}
          colorable
          placeholder={t("VaultEditor.vault-details.name-placeholder")}
        />
        <FormInput
          {...register("project-metadata.type")}
          // isDirty={getFieldState("project-metadata.type", formState).isDirty}
          colorable
          placeholder={t("VaultEditor.vault-details.type-placeholder")}
          label={t("VaultEditor.vault-details.type")}
        />
        <FormInput
          {...register("project-metadata.website")}
          // isDirty={getFieldState("project-metadata.website", formState).isDirty}
          colorable
          placeholder={t("VaultEditor.vault-details.website-placeholder")}
          label={t("VaultEditor.vault-details.website")}
        />
      </div>

      <div className="icons">
        <div className="icons__input">
          <FormIconInput
            {...register("project-metadata.icon")}
            isDirty={getFieldState("project-metadata.icon", formState).isDirty}
            colorable
            label={t("VaultEditor.vault-details.icon")}
          />
        </div>
        <div className="icons__input">
          <FormIconInput
            {...register("project-metadata.tokenIcon")}
            isDirty={getFieldState('project-metadata.tokenIcon', formState).isDirty}
            colorable
            label={t("VaultEditor.vault-details.token-icon")}
          />
        </div>
      </div>
    </StyledVaultDetails>
  );
}
