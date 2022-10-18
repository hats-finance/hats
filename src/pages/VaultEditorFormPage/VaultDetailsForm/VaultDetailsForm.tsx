import { useTranslation } from "react-i18next";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { FormInput, FormIconInput } from "components";
import { IEditedVaultDescription } from "../types";
import { StyledVaultDetails } from "./styles";

export function VaultDetailsForm() {
  const { t } = useTranslation();
  const { register } = useEnhancedFormContext<IEditedVaultDescription>();

  return (
    <StyledVaultDetails>
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
          <FormIconInput
            {...register("project-metadata.icon")}
            colorable
            label={t("VaultEditor.vault-details.icon")}
          />
        </div>
        <div className="icons__input">
          <FormIconInput
            {...register("project-metadata.tokenIcon")}
            colorable
            label={t("VaultEditor.vault-details.token-icon")}
          />
        </div>
      </div>
    </StyledVaultDetails>
  );
}
