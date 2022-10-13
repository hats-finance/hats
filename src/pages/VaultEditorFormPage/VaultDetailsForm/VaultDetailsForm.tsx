import { useTranslation } from "react-i18next";
import { FormInput, FormIconInput } from "components";
import { StyledVaultDetails } from "./styles";
import { useFormContext } from "react-hook-form";

export function VaultDetailsForm() {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <StyledVaultDetails>
      <div className="inputs">
        <label>{t("VaultEditor.vault-details.name")}</label>
        <FormInput
          {...register("project-metadata.name")}
          colorable
          placeholder={t("VaultEditor.vault-details.name-placeholder")}
        />
        <label>{t("VaultEditor.vault-details.type")}</label>
        <FormInput
          {...register("project-metadata.type")}
          colorable
          placeholder={t("VaultEditor.vault-details.type-placeholder")}
        />
        <label>{t("VaultEditor.vault-details.website")}</label>
        <FormInput
          {...register("project-metadata.website")}
          colorable
          placeholder={t("VaultEditor.vault-details.website-placeholder")}
        />
      </div>

      <div className="icons">
        <div className="icons__input">
          <label>{t("VaultEditor.vault-details.icon")}</label>
          <FormIconInput {...register("project-metadata.icon")} colorable />
        </div>
        <div className="icons__input">
          <label>{t("VaultEditor.vault-details.token-icon")}</label>
          <FormIconInput {...register("project-metadata.tokenIcon")} colorable />
        </div>
      </div>
    </StyledVaultDetails>
  );
}
