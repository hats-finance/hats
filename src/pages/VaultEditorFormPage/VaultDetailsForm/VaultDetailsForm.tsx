import { useTranslation } from "react-i18next";
import { HatsFormInput, IconEditor } from "components";
import { StyledVaultDetails } from "./styles";
import { useFormContext } from "react-hook-form";

export function VaultDetailsForm() {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <StyledVaultDetails>
      <div className="inputs">
        <label>{t("VaultEditor.vault-details.name")}</label>
        <HatsFormInput
          {...register("project-metadata.name")}
          placeholder={t("VaultEditor.vault-details.name-placeholder")}
        />
        <label>{t("VaultEditor.vault-details.type")}</label>
        <HatsFormInput
          {...register("project-metadata.type")}
          // value={projectMetaData.type}
          pastable
          copyable
          colorable
          placeholder={t("VaultEditor.vault-details.type-placeholder")}
        />
        <label>{t("VaultEditor.vault-details.website")}</label>
        <HatsFormInput
          {...register("project-metadata.website")}
          pastable
          colorable
          placeholder={t("VaultEditor.vault-details.website-placeholder")}
        />
      </div>

      <div className="icons">
        <div className="icons__input">
          <label>{t("VaultEditor.vault-details.icon")}</label>
          <IconEditor {...register("project-metadata.icon")} colorable />
        </div>
        <div className="icons__input">
          <label>{t("VaultEditor.vault-details.token-icon")}</label>
          <IconEditor {...register("project-metadata.tokenIcon")} colorable />
        </div>
      </div>
    </StyledVaultDetails>
  );
}
