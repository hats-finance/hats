import {
  IEditedVaultDescription,
  IEditedVulnerabilitySeverity,
  createNewCoveredContract,
  getVulnerabilitySeveritiesTemplate,
} from "@hats-finance/shared";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Alert, Button, FormDateInput, FormIconInput, FormInput, FormSelectInput } from "components";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/form";
import { useOnChange } from "hooks/usePrevious";
import { useContext, useEffect } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VaultEditorFormContext } from "../../store";
import { VaultEmailsForm } from "../shared/VaultEmailsList/VaultEmailsList";
import { StyledVaultDetails } from "./styles";

export function VaultDetailsForm() {
  const { t } = useTranslation();
  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const { register, control, resetField, setValue, getValues } = useEnhancedFormContext<IEditedVaultDescription>();
  const { fields, append: appendRepo, remove: removeRepo } = useFieldArray({ control, name: `scope.reposInformation` });
  const watchFieldArray = useWatch({ control, name: `scope.reposInformation` }) ?? [];
  const repos = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const showDateInputs = useWatch({ control, name: "includesStartAndEndTime" });
  const vaultType = useWatch({ control, name: "project-metadata.type" });

  const vaultTypes = [
    { label: t("bugBountyProgram"), value: "normal" },
    { label: t("auditCompetition"), value: "audit" },
    { label: t("grant"), value: "grants" },
  ];

  // Change the start and end time if the showDateInputs property changes
  useEffect(() => {
    if (showDateInputs) {
      resetField("project-metadata.starttime");
      resetField("project-metadata.endtime");
    } else {
      setValue("project-metadata.starttime", undefined);
      setValue("project-metadata.endtime", undefined);
    }
  }, [showDateInputs, setValue, resetField]);

  // Show the start and end time if the vault type is audit or grants
  useEffect(() => {
    const data = getValues();
    if (!data["project-metadata"]) return;

    const { starttime, endtime } = data["project-metadata"];

    if (starttime || endtime) return;

    // Set includesStartAndEndTime property
    if (vaultType === "audit" || vaultType === "grants") setValue("includesStartAndEndTime", true);
    else setValue("includesStartAndEndTime", false);
  }, [vaultType, getValues, setValue]);

  // Change the vulnerability template if the vault type changes
  useOnChange(vaultType, (_, prevVal) => {
    if (prevVal === undefined) return;

    const data = getValues();
    const vulnerabilitySeveritiesTemplate = getVulnerabilitySeveritiesTemplate(data.version, vaultType === "audit");

    const severitiesIds = vulnerabilitySeveritiesTemplate.severities.map((s) => s.id as string);
    const severitiesOptionsForContractsCovered = vulnerabilitySeveritiesTemplate.severities.map(
      (s: IEditedVulnerabilitySeverity) => ({
        label: s.name,
        value: s.id as string,
      })
    );

    setValue("vulnerability-severities-spec", vulnerabilitySeveritiesTemplate);
    setValue("contracts-covered", [{ ...createNewCoveredContract(severitiesIds) }]);
    setValue("severitiesOptions", severitiesOptionsForContractsCovered);
  });

  // Only one repo can be the main repo
  useOnChange(repos, (newRepos, prevRepos) => {
    if (!newRepos || !prevRepos) return;
    if (prevRepos?.length === 0 || newRepos?.length === 0) return;

    const prevMainRepo = prevRepos.find((repo) => repo.isMain);
    if (!prevMainRepo) return;

    const newMainRepo = newRepos.find((repo) => repo.isMain && repo.id !== prevMainRepo?.id);
    if (!newMainRepo) {
      const prevMainRepoIndex = repos.findIndex((repo) => repo.id === prevMainRepo.id);
      setValue(`scope.reposInformation.${prevMainRepoIndex}.isMain`, true);
      return;
    }

    const prevMainRepoIndex = repos.findIndex((repo) => repo.id === prevMainRepo.id);
    setValue(`scope.reposInformation.${prevMainRepoIndex}.isMain`, false);
  });

  return (
    <StyledVaultDetails>
      <div className="sub-container">
        <div className="inputs">
          <FormInput
            {...register("project-metadata.name")}
            label={t("VaultEditor.vault-details.name")}
            colorable
            disabled={allFormDisabled}
            placeholder={t("VaultEditor.vault-details.name-placeholder")}
          />
          <Controller
            control={control}
            name={`project-metadata.type`}
            render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
              <FormSelectInput
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={error}
                label={t("VaultEditor.vault-details.type")}
                placeholder={t("VaultEditor.vault-details.type-placeholder")}
                colorable
                disabled={allFormDisabled}
                options={vaultTypes}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>

        <VaultEmailsForm />

        <div className="inputs col-sm">
          <FormInput
            {...register("project-metadata.website")}
            colorable
            disabled={allFormDisabled}
            placeholder={t("VaultEditor.vault-details.website-placeholder")}
            label={t("VaultEditor.vault-details.website")}
          />

          <div className="icons">
            <FormIconInput
              {...register("project-metadata.icon")}
              disabled={allFormDisabled}
              colorable
              label={t("VaultEditor.vault-details.icon")}
            />
            <FormIconInput
              {...register("project-metadata.tokenIcon")}
              disabled={allFormDisabled}
              colorable
              label={t("VaultEditor.vault-details.token-icon")}
            />
          </div>
        </div>
      </div>

      <br />

      <FormInput
        {...register("includesStartAndEndTime")}
        disabled={allFormDisabled}
        type="toggle"
        label={t("VaultEditor.addStartAndEndDate")}
      />

      {showDateInputs && (
        <div className="inputs">
          <Controller
            control={control}
            name={`project-metadata.starttime`}
            render={({ field, fieldState: { error }, formState: { defaultValues, dirtyFields } }) => (
              <FormDateInput
                withTime
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={error}
                label={t("VaultEditor.vault-details.starttime")}
                placeholder={t("VaultEditor.vault-details.starttime-placeholder")}
                colorable
                disabled={allFormDisabled}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name={`project-metadata.endtime`}
            render={({ field, fieldState: { error }, formState: { defaultValues, dirtyFields } }) => (
              <FormDateInput
                withTime
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={error}
                label={t("VaultEditor.vault-details.endtime")}
                placeholder={t("VaultEditor.vault-details.endtime-placeholder")}
                colorable
                disabled={allFormDisabled}
                {...field}
              />
            )}
          />
        </div>
      )}

      <>
        <p className="section-title mt-3">{t("VaultEditor.vault-details.repoInformation")}</p>
        <div
          className="helper-text"
          dangerouslySetInnerHTML={{
            __html: t(vaultType === "audit" ? "vaultRepoInformationExplanationAudit" : "vaultRepoInformationExplanation"),
          }}
        />

        <div className="repos-information">
          {repos.map((repo, index) => (
            <div className="repo" key={repo.id}>
              <div className="toggle">
                <FormInput
                  {...register(`scope.reposInformation.${index}.isMain`)}
                  label={t("mainRepo")}
                  type="toggle"
                  colorable
                  noMargin
                  disabled={allFormDisabled}
                />
              </div>
              <div className="flex">
                <FormInput
                  {...register(`scope.reposInformation.${index}.url`)}
                  label={t("VaultEditor.vault-details.repoUrl")}
                  colorable
                  helper="ie. https://github.com/hats-finance/hats-contracts"
                  disabled={allFormDisabled}
                  placeholder={t("VaultEditor.vault-details.repoUrl-placeholder")}
                />
                <FormInput
                  {...register(`scope.reposInformation.${index}.commitHash`)}
                  label={t("VaultEditor.vault-details.commitHash")}
                  colorable
                  helper="ie. 9770535cb9.....b63c081cbc"
                  disabled={allFormDisabled}
                  placeholder={t("VaultEditor.vault-details.commitHash-placeholder")}
                />
                <Button styleType="invisible" onClick={() => removeRepo(index)}>
                  <DeleteIcon className="mr-2" />
                  <span>{t("remove")}</span>
                </Button>
              </div>
            </div>
          ))}

          {repos.length === 0 && <Alert type="info">{t("youHaveNotSelectedRepos")}</Alert>}

          <div className="buttons">
            <Button
              className="mt-4"
              styleType="invisible"
              onClick={() => appendRepo({ commitHash: "", url: "", isMain: !repos.some((r) => r.isMain) })}
            >
              <AddIcon className="mr-2" />
              <span>{t("newRepo")}</span>
            </Button>
          </div>
        </div>
      </>
    </StyledVaultDetails>
  );
}
