import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { RoutePaths } from "navigation";
import { ipfsTransformUri } from "utils";
import { fixObject } from "hooks/vaults/useVaults";
import { Loading } from "components";
import { IVaultDescription } from "types";
import { ContractsCoveredList, VaultDetailsForm, CommitteeDetailsForm, CommitteeMembersList } from ".";
import { IEditedVaultDescription, IEditedVulnerabilitySeverityV1 } from "./types";
import { uploadVaultDescriptionToIpfs } from "./vaultService";
import { descriptionToEditedForm, editedFormToDescription, createNewVaultDescription } from "./utils";
import { VulnerabilitySeveritiesList } from "./VulnerabilitySeveritiesList/VulnerabilitySeveritiesList";
import { Section, VaultEditorForm, VaultEditorStep, VaultEditorStepper } from "./styles";
import { convertVulnerabilitySeverityV1ToV2 } from "./severities";
import { getEditedDescriptionYupSchema } from "./formSchema";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

const VaultEditorFormPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loadingFromIpfs, setLoadingFromIpfs] = useState<boolean>(false);
  const [savingToIpfs, setSavingToIpfs] = useState(false);
  const { ipfsHash } = useParams();
  const [searchParams] = useSearchParams();

  const editorSteps = {
    setup: {
      name: "Vault Description",
      steps: [
        { name: "Details", title: "Vault description", component: VaultDetailsForm },
        { name: "Committee", title: "Committee details", component: CommitteeDetailsForm },
        { name: "Members", title: "Committee members and Encryption keys", component: CommitteeMembersList },
        { name: "Severities", title: "Severities", component: VulnerabilitySeveritiesList },
        { name: "Contracts", title: "Contracts/Assets covered", component: ContractsCoveredList },
        // { name: "Review", title: "Vault review", component: VaultFormReview },
      ],
    },
    deployment: {
      0: { name: "Details" },
    },
  };

  const actualStep = editorSteps.setup;

  const isAdvancedMode = searchParams.get("mode") && searchParams.get("mode")?.includes("advanced");

  const methods = useForm<IEditedVaultDescription>({
    defaultValues: createNewVaultDescription("v2"),
    resolver: getEditedDescriptionYupSchema(t),
  });
  const { handleSubmit, formState, reset: handleReset, control, setValue, getValues } = methods;

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

  if (loadingFromIpfs || savingToIpfs) {
    return <Loading fixed />;
  }

  const onSubmit = (data: IEditedVaultDescription) => {
    saveToIpfs(editedFormToDescription(data));
  };

  return (
    <FormProvider {...methods}>
      <button className="mb-5" onClick={test}>
        Show form
      </button>
      <VaultEditorForm className="content-wrapper" onSubmit={handleSubmit(onSubmit)}>
        {/* <div className="editor-title">
          {t("VaultEditor.create-vault")} <small>({vaultVersion})</small>
        </div> */}
        {/* <p className="editor-description">{t("VaultEditor.create-vault-description")}</p> */}

        {/* {ipfsHash && vaultVersion === "v1" && (
          <>
            <p>We will stop supporting v1 vaults, please migrate your vault to v2</p>
            <button
              className="migrate-button fill"
              type="button"
              onClick={() => setValue("version", "v2", { shouldDirty: true })}>
              Migrate description to v2
            </button>
          </>
        )} */}

        <div className="editor-title">
          <ArrowBackIcon />
          <p>
            {t("vaultCreator")}
            <span>/{actualStep.name}</span>
          </p>
        </div>

        <VaultEditorStepper>
          {actualStep.steps.map((step, index) => (
            <VaultEditorStep key={step.name} active={index === 1} passed={index === 0}>
              {index + 1}.{step.name}
            </VaultEditorStep>
          ))}
        </VaultEditorStepper>

        {actualStep.steps.map((step, index) => (
          <Section key={index}>
            <p className="section-title">{step.title}</p>
            <div className="section-content">
              <step.component />
            </div>
          </Section>
        ))}

        {/* <Section>
          <p className="section-title">1. {t("VaultEditor.vault-details.title")}</p>
          <div className="section-content">
            <VaultDetailsForm />
          </div>
        </Section>

        <Section>
          <p className="section-title">2. {t("VaultEditor.committee-members")}</p>
          <div className="section-content">
            <CommitteeMembersList />
          </div>
        </Section>

        <Section>
          <p className="section-title">3. {t("VaultEditor.committee-details")}</p>
          <div className="section-content">
            <CommitteeDetailsForm />
          </div>
        </Section>

        <Section>
          <p className="section-title">4. {t("VaultEditor.contracts-covered")}</p>
          <div className="section-content">
            <ContractsCoveredList />
          </div>
        </Section>

        <Section>
          <p className="section-title">5. {t("VaultEditor.pgp-key")}</p>
          <div className="section-content">
            <CommunicationChannelForm />
          </div>
        </Section>

        <Section>
          <p className="section-title">6. {t("VaultEditor.vulnerabilities")}</p>
          <div className="section-content">
            <VulnerabilitySeveritiesList />
          </div>
        </Section>

        <Section>
          <p className="section-title">{t("VaultEditor.review-vault.title")}</p>
          <div className="section-content">
            <VaultFormReview />
          </div>
        </Section> */}

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

      {/* <div className="form-devtool">
        <DevTool control={control} />
      </div> */}
    </FormProvider>
  );
};

export { VaultEditorFormPage };
