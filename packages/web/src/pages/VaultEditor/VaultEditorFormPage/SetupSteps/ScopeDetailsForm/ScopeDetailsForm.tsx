import { CODE_LANGUAGES, IEditedVaultDescription } from "@hats-finance/shared";
import { FormInput, FormMDEditor, FormRadioInput, Pill } from "components";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/form";
import { useContext, useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VaultEditorFormContext } from "../../store";
import { ContractsCoveredList } from "./ContractsCoveredList/ContractsCoveredList";
import { ScopeReposInformation } from "./ScopeReposInformation/ScopeReposInformation";
import { StyledScopeDetailsForm } from "./styles";

export const ScopeDetailsForm = () => {
  const { t } = useTranslation();
  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const { control, register, setValue, getValues, watch } = useEnhancedFormContext<IEditedVaultDescription>();

  const handleClickOnCodeLang = (codeLang: string, checked: boolean) => {
    const codeLangs = getValues("scope.codeLangs") ?? [];
    if (checked) {
      setValue("scope.codeLangs", [...codeLangs, codeLang]);
    } else {
      setValue(
        "scope.codeLangs",
        codeLangs.filter((lang) => lang !== codeLang)
      );
    }
  };

  const toolingOptions = useMemo(() => {
    return [
      { value: "hardhat", label: "Hardhat" },
      { value: "foundry", label: "Foundry" },
      { value: "custom", label: t("custom") },
    ];
  }, [t]);

  return (
    <StyledScopeDetailsForm>
      <div className="helper-text">{t("vaultEditorScopeExplanation")}</div>

      {/* Project Outline */}
      <p className="mb-3 bold">{t("offerDescriptionHowTheProtocolWorks")}</p>

      <Controller
        control={control}
        name={`scope.description`}
        render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
          <FormMDEditor
            disabled={allFormDisabled}
            isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
            error={error}
            initialState="edit"
            colorable
            {...field}
          />
        )}
      />

      {/* Project Coding languages */}
      <p className="mb-3 bold">{t("VaultEditor.selectCodeLanguages")}</p>
      <div className="code-langs mb-3">
        {CODE_LANGUAGES.solidity.map((codeLang) => (
          <Pill
            key={codeLang}
            onClick={allFormDisabled ? undefined : (checked) => handleClickOnCodeLang(codeLang, checked)}
            isChecked={watch("scope.codeLangs", []).some((lang) => lang === codeLang)}
            text={codeLang}
          />
        ))}
      </div>
      <div className="code-langs">
        {CODE_LANGUAGES.other.map((codeLang) => (
          <Pill
            key={codeLang}
            onClick={allFormDisabled ? undefined : (checked) => handleClickOnCodeLang(codeLang, checked)}
            isChecked={watch("scope.codeLangs", []).some((lang) => lang === codeLang)}
            text={codeLang}
          />
        ))}
      </div>

      <br />

      {/* Repos and documentation */}
      <p className="section-title mt-5">{t("VaultEditor.reposAndDocumentation")}</p>
      <ScopeReposInformation />
      <p className="mb-3 mt-5 bold">{t("VaultEditor.linkToProtocolDocs")}</p>
      <FormInput
        {...register(`scope.docsLink`)}
        label={t("VaultEditor.protocolDocs")}
        colorable
        disabled={allFormDisabled}
        placeholder={t("VaultEditor.linkToProtocolDocs-placeholder")}
      />

      <br />

      {/* Contracts/assets covered */}
      <p className="section-title mt-5">{t("VaultEditor.contractsAssetsCovered")}</p>
      <ContractsCoveredList />

      <br />

      {/* Out of scope */}
      <p className="section-title mt-5">{t("VaultEditor.outOfScope")}</p>
      <p className="mb-3 mt-5 bold">{t("VaultEditor.outOfScopeExplanation")}</p>
      <Controller
        control={control}
        name={`scope.outOfScope`}
        render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
          <FormMDEditor
            disabled={allFormDisabled}
            isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
            error={error}
            initialState="edit"
            colorable
            {...field}
          />
        )}
      />

      <br />

      {/* Steps to run project */}
      <p className="section-title mt-5">{t("VaultEditor.stepsToRunProject")}</p>
      <p className="mb-3 mt-5 bold">{t("VaultEditor.stepsToRunProjectExplanation")}</p>
      <Controller
        control={control}
        name={`scope.protocolSetupInstructions.tooling`}
        render={({ field }) => (
          <FormRadioInput
            disabled={allFormDisabled}
            label={t("Payouts.choosePayoutType")}
            radioOptions={toolingOptions}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={`scope.protocolSetupInstructions.instructions`}
        render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
          <FormMDEditor
            disabled={allFormDisabled}
            isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
            error={error}
            initialState="edit"
            colorable
            {...field}
          />
        )}
      />
    </StyledScopeDetailsForm>
  );
};