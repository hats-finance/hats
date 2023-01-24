import { useTranslation } from "react-i18next";
import { FormInput } from "components";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { IEditedVaultDescription } from "../../types";
import { StyledVaultParametersForm } from "./styles";

export const VaultParametersForm = () => {
  const { t } = useTranslation();

  const { register } = useEnhancedFormContext<IEditedVaultDescription>();

  return (
    <StyledVaultParametersForm>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorMaxBountyExplanation") }} />

      <div className="input">
        <FormInput
          {...register(`parameters.maxBountyPercentage`)}
          label={t("VaultEditor.vault-parameters.maxBountyPercentage")}
          placeholder={t("VaultEditor.vault-parameters.maxBountyPercentage-placeholder")}
          colorable
        />
      </div>

      <p className="section-title">{t("bountySplit")}</p>

      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorBountySplitExplanation") }} />
    </StyledVaultParametersForm>
  );
};
