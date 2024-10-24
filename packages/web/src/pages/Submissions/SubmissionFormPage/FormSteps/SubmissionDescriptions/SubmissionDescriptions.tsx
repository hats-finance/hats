import { GithubIssue, ISubmissionMessageObject, IVulnerabilitySeverity } from "@hats.finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import RemoveIcon from "@mui/icons-material/DeleteOutlined";
import {
  Alert,
  Button,
  FormInput,
  FormMDEditor,
  FormSelectInput,
  FormSelectInputOption,
  FormSupportFilesInput,
  WithTooltip,
} from "components";
import download from "downloadjs";
import { getCustomIsDirty, useEnhancedForm } from "hooks/form";
import { getGithubIssuesFromVault } from "pages/CommitteeTools/SubmissionsTool/submissionsService.api";
import { useContext, useEffect, useState } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { encryptWithHatsKey, encryptWithKeys } from "../../encrypt";
import { SUBMISSION_INIT_DATA, SubmissionFormContext } from "../../store";
import { ISubmissionsDescriptionsData } from "../../types";
import { getCreateDescriptionSchema } from "./formSchema";
import { StyledSubmissionDescription, StyledSubmissionDescriptionsList } from "./styles";
import { getAuditSubmissionTexts, getBountySubmissionTexts } from "./utils";

export function SubmissionDescriptions() {
  const { t } = useTranslation();

  const { submissionData, setSubmissionData, vault, allFormDisabled } = useContext(SubmissionFormContext);
  const [severitiesOptions, setSeveritiesOptions] = useState<FormSelectInputOption[] | undefined>();

  const isAuditSubmission = vault?.description?.["project-metadata"].type === "audit";
  const isPrivateAudit = vault?.description?.["project-metadata"].isPrivateAudit;

  const [vaultGithubIssuesOpts, setVaultGithubIssuesOpts] = useState<FormSelectInputOption[] | undefined>();
  const [vaultGithubIssues, setVaultGithubIssues] = useState<GithubIssue[] | undefined>(undefined);
  const [isLoadingGH, setIsLoadingGH] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useEnhancedForm<ISubmissionsDescriptionsData>({
    resolver: yupResolver(getCreateDescriptionSchema(t)),
    mode: "onChange",
  });
  const {
    fields,
    append: appendSubmissionDescription,
    remove: removeSubmissionDescription,
  } = useFieldArray({ control, name: `descriptions` });

  const watchDescriptions = useWatch({ control, name: `descriptions` });
  const controlledDescriptions = fields.map((field, index) => {
    return {
      ...field,
      ...watchDescriptions[index],
    };
  });

  // Reset form with saved data
  useEffect(() => {
    if (submissionData?.submissionsDescriptions) reset(submissionData.submissionsDescriptions);
  }, [submissionData, reset]);

  // Get severities information
  useEffect(() => {
    if (!vault || !vault.description) return;

    if (vault.description) {
      const severities = vault.description.severities.map((severity: IVulnerabilitySeverity) => ({
        label: severity.name.toLowerCase().replace("severity", "").trim(),
        value: severity.name.toLowerCase(),
      }));

      setSeveritiesOptions(severities);
    }
  }, [vault, t]);

  // Update isEncrypted field on descriptions
  useEffect(() => {
    if (!vault || !vault.description || !vault.description.severities) return;

    for (const [idx, description] of controlledDescriptions.entries()) {
      if (description.type === "complement") {
        if (description.isEncrypted === true) setValue(`descriptions.${idx}.isEncrypted`, false);
        continue;
      }

      const severitySelected =
        vault.description?.severities &&
        (vault.description.severities as IVulnerabilitySeverity[]).find((sev) => sev.name.toLowerCase() === description.severity);

      if (severitySelected) {
        let isEncrypted = true;
        if (isAuditSubmission) {
          const val = severitySelected.decryptSubmissions;
          if (Array.isArray(val)) {
            isEncrypted = val.length === 0 || !val.every((v) => v === "on");
          } else {
            isEncrypted = !val;
          }
        }

        if (isEncrypted !== description.isEncrypted) {
          setValue(`descriptions.${idx}.isEncrypted`, isEncrypted);
        }
      }
    }
  }, [controlledDescriptions, vault, setValue, isAuditSubmission]);

  // Get information from github
  const someComplementSubmission = controlledDescriptions.some((desc) => desc.type === "complement");
  useEffect(() => {
    if (!someComplementSubmission) return;
    if (!vault) return;
    if (vaultGithubIssues !== undefined || isLoadingGH) return;
    const loadGhIssues = async () => {
      // console.log(1);
      setIsLoadingGH(true);
      const ghIssues = await getGithubIssuesFromVault(vault);
      const ghIssuesOpts = ghIssues.map((ghIssue) => ({
        label: `[#${ghIssue.number}] ${ghIssue.title}`,
        value: `${ghIssue.number}`,
      }));
      setVaultGithubIssuesOpts(ghIssuesOpts);
      setVaultGithubIssues(ghIssues);
      setIsLoadingGH(false);
    };
    loadGhIssues();
  }, [vault, vaultGithubIssues, isLoadingGH, someComplementSubmission]);

  const handleSaveAndDownloadDescription = async (formData: ISubmissionsDescriptionsData) => {
    if (!vault) return;
    if (!submissionData) return alert("Please fill previous steps first.");

    let keyOrKeys: string | string[];

    // Get public keys from vault description
    if (vault.version === "v1") {
      keyOrKeys = vault.description?.["communication-channel"]?.["pgp-pk"] ?? [];
    } else {
      keyOrKeys =
        vault.description?.committee.members.reduce(
          (prev: string[], curr) => [...prev, ...curr["pgp-keys"].map((key) => key.publicKey)],
          []
        ) ?? [];
    }

    keyOrKeys = typeof keyOrKeys === "string" ? keyOrKeys : keyOrKeys.filter((key) => !!key);
    if (keyOrKeys.length === 0) return alert("This project has no keys to encrypt the description. Please contact HATS team.");

    const getSubmissionTextsFunction = isAuditSubmission ? getAuditSubmissionTexts : getBountySubmissionTexts;
    const submissionTexts = getSubmissionTextsFunction(submissionData, formData.descriptions);

    const toEncrypt = submissionTexts.toEncrypt;
    const decrypted = submissionTexts.decrypted;
    const submissionMessage = submissionTexts.submissionMessage;

    const encryptionResult = await encryptWithKeys(keyOrKeys, toEncrypt);
    if (!encryptionResult) return alert("This vault doesn't have any valid key, please contact hats team");

    const { encryptedData, sessionKey } = encryptionResult;

    let submissionInfo: ISubmissionMessageObject | undefined;

    try {
      submissionInfo = {
        ref: submissionData.ref,
        isEncryptedByHats: isPrivateAudit,
        decrypted: isPrivateAudit ? await encryptWithHatsKey(decrypted ?? "--Nothing decrypted--") : decrypted,
        encrypted: encryptedData as string,
      };
    } catch (error) {
      console.log(error);
      return alert("There was a problem encrypting the submission with Hats key. Please contact HATS team.");
    }

    download(
      JSON.stringify({ submission: submissionInfo, sessionKey }),
      `${submissionData.project?.projectName}-${new Date().getTime()}.json`
    );

    console.log({
      submissionMessage,
      submissionInfo: JSON.stringify(submissionInfo),
      descriptions: formData.descriptions,
    });

    setSubmissionData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        submissionsDescriptions: {
          verified: true,
          submission: JSON.stringify(submissionInfo),
          submissionMessage: submissionMessage,
          descriptions: formData.descriptions,
        },
        submissionResult: undefined,
      };
    });
  };

  if (!vault) return <Alert type="error">{t("Submissions.firstYouNeedToSelectAProject")}</Alert>;

  const getNewIssueForm = (submissionDescription: (typeof controlledDescriptions)[number], index: number) => {
    return (
      <>
        <p className="mb-4">{t("Submissions.provideExplanation")}</p>
        <div className="row">
          <FormInput
            {...register(`descriptions.${index}.title`)}
            disabled={allFormDisabled}
            label={`${t("Submissions.submissionTitle")}`}
            placeholder={t("Submissions.submissionTitlePlaceholder")}
            colorable
          />
          <Controller
            control={control}
            name={`descriptions.${index}.severity`}
            render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
              <FormSelectInput
                disabled={allFormDisabled}
                isDirty={getCustomIsDirty<ISubmissionsDescriptionsData>(field.name, dirtyFields, defaultValues)}
                error={error}
                label={t("severity")}
                placeholder={t("severityPlaceholder")}
                colorable
                options={severitiesOptions ?? []}
                {...field}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name={`descriptions.${index}.description`}
          render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
            <FormMDEditor
              disabled={allFormDisabled}
              isDirty={getCustomIsDirty<ISubmissionsDescriptionsData>(field.name, dirtyFields, defaultValues)}
              error={error}
              colorable
              {...field}
            />
          )}
        />

        {!submissionDescription.isEncrypted && !allFormDisabled && (
          <Controller
            control={control}
            name={`descriptions.${index}.files`}
            render={({ field, fieldState: { error } }) => (
              <FormSupportFilesInput label={t("Submissions.selectSupportFiles")} error={error} {...field} />
            )}
          />
        )}
      </>
    );
  };

  const getComplementIssueForm = (submissionDescription: (typeof controlledDescriptions)[number], index: number) => {
    return (
      <>
        <p className="mb-4">{t("Submissions.selectIssueToComplement")}</p>
        <Controller
          control={control}
          name={`descriptions.${index}.complementGhIssueNumber`}
          render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
            <FormSelectInput
              disabled={allFormDisabled}
              isDirty={getCustomIsDirty<ISubmissionsDescriptionsData>(field.name, dirtyFields, defaultValues)}
              error={error}
              label={t("Submissions.githubIssue")}
              placeholder={t("Submissions.selectGithubIssue")}
              colorable
              options={vaultGithubIssuesOpts ?? []}
              {...field}
              value={field.value ?? ""}
              onChange={(a) => {
                field.onChange(a);
                const ghIssue = vaultGithubIssues?.find((gh) => gh.number === Number(a as string));
                if (ghIssue) setValue(`descriptions.${index}.complementGhIssue`, ghIssue);
              }}
            />
          )}
        />

        {/* Fix PR section */}
        <>
          <p className="mb-2">{t("Submissions.addFixFiles")}:</p>
          <p className="mb-4">{t("Submissions.addFixFilesExplanation")}</p>
          <FormSupportFilesInput
            label={t("Submissions.selectFixFiles")}
            name={`descriptions.${index}.complementFixFiles`}
            uploadTo="ipfs"
            noFilesAttachedInfo
            value={[]}
            colorable
            error={
              errors.descriptions?.[index]?.complementFixFiles?.type === "min"
                ? (errors.descriptions?.[index]?.complementFixFiles as never)
                : undefined
            }
            onChange={(a) => {
              if (!a?.length) return;
              for (const file of a) {
                const fixFiles = getValues(`descriptions.${index}.complementFixFiles`);
                if (fixFiles.some((f) => f.file.ipfsHash === file.ipfsHash)) continue;
                setValue(`descriptions.${index}.complementFixFiles`, [...fixFiles, { file, path: `test/${file.name}` }]);
              }
            }}
          />

          <div className="files-attached-container">
            <div className="files">
              {(submissionDescription.complementFixFiles ?? []).map((item, idx) => (
                <li key={idx}>
                  <div className="file">
                    <CloseIcon
                      className="remove-icon"
                      onClick={() => {
                        const fixFiles = getValues(`descriptions.${index}.complementFixFiles`);
                        setValue(
                          `descriptions.${index}.complementFixFiles`,
                          fixFiles.filter((_, fileIndex) => fileIndex !== idx)
                        );
                      }}
                    />
                    <p>{item.file.name}</p>
                  </div>

                  <div className="file-path">
                    <p>{t("Submissions.filePath")}:</p>
                    <FormInput
                      {...register(`descriptions.${index}.complementFixFiles.${idx}.path`)}
                      disabled={allFormDisabled}
                      label={`${t("Submissions.filePath")}`}
                      placeholder={t("Submissions.filePathPlaceholder")}
                      colorable
                    />
                  </div>
                </li>
              ))}
            </div>
          </div>
        </>

        <div className="mt-5" />

        {/* Test PR section */}
        {!submissionDescription.testNotApplicable && (
          <>
            <p className="mb-2">{t("Submissions.addTestFiles")}:</p>
            <p className="mb-4">{t("Submissions.addTestFilesExplanation")}</p>
            <FormSupportFilesInput
              label={t("Submissions.selectTestFiles")}
              name={`descriptions.${index}.complementTestFiles`}
              uploadTo="ipfs"
              noFilesAttachedInfo
              value={[]}
              colorable
              error={
                errors.descriptions?.[index]?.complementTestFiles?.type === "min"
                  ? (errors.descriptions?.[index]?.complementTestFiles as never)
                  : undefined
              }
              onChange={(a) => {
                if (!a?.length) return;
                for (const file of a) {
                  const testFiles = getValues(`descriptions.${index}.complementTestFiles`);
                  if (testFiles.some((f) => f.file.ipfsHash === file.ipfsHash)) continue;
                  setValue(`descriptions.${index}.complementTestFiles`, [...testFiles, { file, path: `test/${file.name}` }]);
                }
              }}
            />

            {/* <p className="mb-4">{t("Submissions.filesAttached")}:</p> */}
            <div className="files-attached-container">
              <div className="files">
                {(submissionDescription.complementTestFiles ?? []).map((item, idx) => (
                  <li key={idx}>
                    <div className="file">
                      <CloseIcon
                        className="remove-icon"
                        onClick={() => {
                          const testFiles = getValues(`descriptions.${index}.complementTestFiles`);
                          setValue(
                            `descriptions.${index}.complementTestFiles`,
                            testFiles.filter((_, fileIndex) => fileIndex !== idx)
                          );
                        }}
                      />
                      <p>{item.file.name}</p>
                    </div>

                    <div className="file-path">
                      <p>{t("Submissions.filePath")}:</p>
                      <FormInput
                        {...register(`descriptions.${index}.complementTestFiles.${idx}.path`)}
                        disabled={allFormDisabled}
                        label={`${t("Submissions.filePath")}`}
                        placeholder={t("Submissions.filePathPlaceholder")}
                        colorable
                      />
                    </div>
                  </li>
                ))}
              </div>
            </div>
          </>
        )}
        <div>
          <FormInput
            {...register(`descriptions.${index}.testNotApplicable`)}
            noMargin
            type="checkbox"
            label={t("Submissions.testNotApplicable")}
          />
        </div>
      </>
    );
  };

  return (
    <StyledSubmissionDescriptionsList>
      {controlledDescriptions.map((submissionDescription, index) => {
        return (
          <StyledSubmissionDescription key={submissionDescription.id} isEncrypted={!!submissionDescription.isEncrypted}>
            <p className="title mb-2">
              <span>
                {t("submission")} #{index + 1}
              </span>
              {((submissionDescription.type === "new" && submissionDescription.severity) ||
                submissionDescription.type === "complement") && (
                <WithTooltip
                  text={
                    submissionDescription.isEncrypted
                      ? t("Submissions.encryptedSubmissionExplanation")
                      : t("Submissions.decryptedSubmissionExplanation")
                  }
                >
                  <span className="encryption-info">
                    {submissionDescription.isEncrypted
                      ? t("Submissions.encryptedSubmission")
                      : t("Submissions.decryptedSubmission")}
                  </span>
                </WithTooltip>
              )}
            </p>

            <div className="options mt-3 mb-5">
              <div className="option" onClick={() => setValue(`descriptions.${index}.type`, "new")}>
                <div className={`check-circle ${submissionDescription.type === "new" ? "selected" : ""}`} />
                <div className="info">
                  <p>{t("newSubmission")}</p>
                </div>
              </div>

              <div className="option" onClick={() => setValue(`descriptions.${index}.type`, "complement")}>
                <div className={`check-circle ${submissionDescription.type === "complement" ? "selected" : ""}`} />
                <div className="info">
                  <p>{t("complementSubmission")}</p>
                </div>
              </div>
            </div>

            {submissionDescription.type === "new"
              ? getNewIssueForm(submissionDescription, index)
              : getComplementIssueForm(submissionDescription, index)}

            {controlledDescriptions.length > 1 && !allFormDisabled && (
              <div className="buttons mt-3">
                <Button onClick={() => removeSubmissionDescription(index)} styleType="outlined" filledColor="secondary">
                  <RemoveIcon className="mr-3" />
                  {t("Submissions.removeIssue")}
                </Button>
              </div>
            )}
          </StyledSubmissionDescription>
        );
      })}

      <div className="buttons mt-3">
        {!allFormDisabled && (
          <Button
            onClick={() => appendSubmissionDescription(SUBMISSION_INIT_DATA.submissionsDescriptions.descriptions[0])}
            styleType="invisible"
          >
            <AddIcon className="mr-3" />
            {t("Submissions.addAnotherVulnerability")}
          </Button>
        )}
        <Button onClick={handleSubmit(handleSaveAndDownloadDescription)}>{t("Submissions.saveAndDownload")}</Button>
      </div>
    </StyledSubmissionDescriptionsList>
  );
}
