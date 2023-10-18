import { CODE_LANGUAGES, DEFAULT_OUT_OF_SCOPE, DEFAULT_TOOLING_STEPS, IEditedVaultDescription } from "@hats-finance/shared";
import { Alert, Button, FormInput, FormMDEditor, FormRadioInput, Pill } from "components";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/form";
import useConfirm from "hooks/useConfirm";
import { useContext, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VaultEditorFormContext } from "../../store";
import { ContractsCoveredList } from "./ContractsCoveredList/ContractsCoveredList";
import { ScopeReposInformation } from "./ScopeReposInformation/ScopeReposInformation";
import { StyledScopeDetailsForm } from "./styles";

export const ScopeDetailsForm = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const { allFormDisabled, isAdvancedMode } = useContext(VaultEditorFormContext);

  const { control, register, setValue, getValues, watch } = useEnhancedFormContext<IEditedVaultDescription>();

  const vaultType = useWatch({ control, name: "project-metadata.type" });
  const isPrivateAudit = useWatch({ control, name: "project-metadata.isPrivateAudit" });
  const isAudit = vaultType === "audit";

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

  const setProtocolInstructionsDefault = async () => {
    const wantsToDefault = await confirm({
      title: t("wantsToSetDefaultValue"),
      description: t("wantsToSetDefaultValueExplanation"),
      cancelText: t("no"),
      confirmText: t("setTemplateValue"),
    });
    if (!wantsToDefault) return;

    setValue("scope.protocolSetupInstructions", DEFAULT_TOOLING_STEPS);
  };

  const setOutOfScopeDefault = async () => {
    const wantsToDefault = await confirm({
      title: t("wantsToSetDefaultValue"),
      description: t("wantsToSetDefaultValueExplanation"),
      cancelText: t("no"),
      confirmText: t("setTemplateValue"),
    });
    if (!wantsToDefault) return;

    setValue("scope.outOfScope", DEFAULT_OUT_OF_SCOPE);
  };

  return (
    <StyledScopeDetailsForm>
      {/* Private audits alert */}
      {isPrivateAudit && (
        <Alert className="mt-2 mb-4" type="warning">
          {t("scopePrivateAuditsWarning")}
        </Alert>
      )}

      {/* Project Outline */}
      {isAdvancedMode && !isPrivateAudit && (
        <>
          <div className="helper-text">{t("vaultEditorScopeExplanation")}</div>
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
        </>
      )}

      {/* Project Coding languages */}
      {isAdvancedMode && !isPrivateAudit && (
        <>
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
        </>
      )}

      {/* Repos and documentation */}
      {!isPrivateAudit && (
        <>
          <p className="section-title mt-5">{t("VaultEditor.reposAndDocumentation")}</p>
          <ScopeReposInformation />
        </>
      )}

      {isAdvancedMode && !isPrivateAudit && (
        <>
          <p className="mb-3 mt-5 bold">{t("VaultEditor.linkToProtocolDocs")}</p>
          <FormInput
            {...register(`scope.docsLink`)}
            label={t("VaultEditor.protocolDocs")}
            colorable
            disabled={allFormDisabled}
            placeholder={t("VaultEditor.linkToProtocolDocs-placeholder")}
          />
        </>
      )}

      <br />

      {/* Contracts/assets covered */}
      {(isAudit && watch("contracts-covered").length > 0) || !isAudit ? (
        <>
          <p className="section-title mt-5">{t("VaultEditor.contractsAssetsCovered")}</p>
          <ContractsCoveredList />
          <br />
        </>
      ) : null}

      {/* Out of scope */}
      {isAdvancedMode && !isPrivateAudit && (
        <>
          <p className="section-title mt-5">
            {t("VaultEditor.outOfScope")}

            <Button className="ml-3" styleType="text" onClick={setOutOfScopeDefault}>
              {t("useTemplateData")}
            </Button>
          </p>
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
        </>
      )}

      {/* Steps to run project */}
      {isAdvancedMode && !isPrivateAudit && (
        <>
          <p className="section-title mt-5">
            {t("VaultEditor.stepsToRunProject")}
            <Button className="ml-3" styleType="text" onClick={setProtocolInstructionsDefault}>
              {t("useTemplateData")}
            </Button>
          </p>
          <p className="mb-3 mt-5 bold">{t("VaultEditor.stepsToRunProjectExplanation")}</p>
          <Controller
            control={control}
            name={`scope.protocolSetupInstructions.tooling`}
            render={({ field }) => (
              <FormRadioInput
                disabled={allFormDisabled}
                label={t("Payouts.chooseToolingOption")}
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
        </>
      )}
    </StyledScopeDetailsForm>
  );
};
