import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { RoutePaths } from "navigation";
import { ipfsTransformUri } from "utils";
import { fixObject } from "hooks/vaults/useVaults";
import { Loading } from "components";
import { IVaultDescription } from "types";
import { IEditedVaultDescription, IEditedVulnerabilitySeverityV1 } from "./types";
import { uploadVaultDescriptionToIpfs } from "./vaultService";
import { descriptionToEditedForm, editedFormToDescription, createNewVaultDescription } from "./utils";
import { Section, VaultEditorForm, VaultEditorStep, VaultEditorStepper } from "./styles";
import { convertVulnerabilitySeverityV1ToV2 } from "./severities";
import { getEditedDescriptionYupSchema } from "./formSchema";
import { useVaultEditorSteps } from "./useVaultEditorSteps";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import CheckIcon from "@mui/icons-material/Check";

const VaultEditorFormPage = () => {
  const { t } = useTranslation();
  const { ipfsHash } = useParams();
  const navigate = useNavigate();

  const [loadingFromIpfs, setLoadingFromIpfs] = useState<boolean>(false);
  const [savingToIpfs, setSavingToIpfs] = useState(false);

  const methods = useForm<IEditedVaultDescription>({
    defaultValues: createNewVaultDescription("v2"),
    resolver: getEditedDescriptionYupSchema(t),
    mode: "onChange",
  });
  const { handleSubmit, formState, reset: handleReset, control, setValue, getValues } = methods;
  const { steps, currentStepInfo, onChangeCurrentStepNumber } = useVaultEditorSteps(methods);

  const vaultVersion = useWatch({ control, name: "version" });

  async function loadFromIpfs(ipfsHash: string) {
    try {
      setLoadingFromIpfs(true);
      const response = await fetch(ipfsTransformUri(ipfsHash));
      const newVaultDescription = await response.json();
      handleReset(descriptionToEditedForm(fixObject(newVaultDescription)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFromIpfs(false);
    }
  }

  const test = () => {
    console.log(getValues());
  };

  useEffect(() => {
    if (ipfsHash) loadFromIpfs(ipfsHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipfsHash]);

  useEffect(() => {
    const dirtyFields = Object.keys(formState.dirtyFields);
    if (!dirtyFields.includes("version")) return;

    const onlyVersionDirty = dirtyFields.length === 1 && dirtyFields[0] === "version";

    // If it's a new and clean form description in v1
    if (!ipfsHash && onlyVersionDirty) {
      handleReset(createNewVaultDescription(vaultVersion));
    }

    // Changing from v2 to v1 is not supported
    if (vaultVersion === "v1") return;

    // If it's not a clean form description
    if (ipfsHash || (!ipfsHash && !onlyVersionDirty)) {
      const indexArray = getValues("vulnerability-severities-spec.indexArray");
      const currentSeverities = getValues("vulnerability-severities-spec.severities") as IEditedVulnerabilitySeverityV1[];

      const newSeverities = currentSeverities.map((s) => convertVulnerabilitySeverityV1ToV2(s, indexArray));
      setValue("vulnerability-severities-spec.severities", newSeverities, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultVersion]);

  async function saveToIpfs(vaultDescription: IVaultDescription) {
    try {
      setSavingToIpfs(true);
      const ipfsHash = await uploadVaultDescriptionToIpfs(vaultDescription);
      navigate(`${RoutePaths.vault_editor}/${ipfsHash}`);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingToIpfs(false);
    }
  }

  const onSubmit = (data: IEditedVaultDescription) => {
    saveToIpfs(editedFormToDescription(data));
  };

  if (loadingFromIpfs || savingToIpfs) return <Loading fixed />;

  return (
    <FormProvider {...methods}>
      <button className="mb-5" onClick={test}>
        Show form
      </button>
      <VaultEditorForm className="content-wrapper" onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div className="editor-title">
          <div className="title">
            <ArrowBackIcon />
            <p>
              {t("vaultCreator")}
              <span>/{currentStepInfo.name}</span>
            </p>
          </div>
        </div>

        {/* Steps control */}
        <VaultEditorStepper>
          {steps.map((step, index) => (
            <VaultEditorStep
              key={step.id}
              // disabled={index > maxStep}
              active={step.id === currentStepInfo.id}
              passed={!!step.isValid}
              onClick={() => onChangeCurrentStepNumber(index)}>
              {index + 1}.{step.name}
              {step.isValid && <CheckIcon className="ml-2" />}
            </VaultEditorStep>
          ))}
        </VaultEditorStepper>

        {/* Section */}
        {steps.map((step) => (
          <Section key={step.id} visible={step.id === currentStepInfo.id}>
            <p className="section-title">{step.title}</p>
            <div className="section-content">
              <step.component />
            </div>
          </Section>
        ))}

        {/* Action buttons */}
        <div className="buttons-container">
          {formState.isDirty && ipfsHash && (
            <button type="button" onClick={() => handleReset()} className="fill">
              {t("VaultEditor.reset-button")}
            </button>
          )}
          <button type="button" onClick={handleSubmit(onSubmit)} className="fill" disabled={!formState.isDirty}>
            {t("VaultEditor.save-button")}
          </button>
        </div>
      </VaultEditorForm>
    </FormProvider>
  );
};

export { VaultEditorFormPage };
