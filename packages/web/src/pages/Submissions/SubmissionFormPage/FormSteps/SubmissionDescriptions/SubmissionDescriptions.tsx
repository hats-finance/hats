import { ISubmissionMessageObject, IVulnerabilitySeverity } from "@hats.finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/AddOutlined";
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

  const { register, handleSubmit, control, reset, setValue } = useEnhancedForm<ISubmissionsDescriptionsData>({
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
      const severitySelected =
        vault.description?.severities &&
        (vault.description.severities as IVulnerabilitySeverity[]).find((sev) => sev.name.toLowerCase() === description.severity);

      if (severitySelected) {
        const isEncrypted = !isAuditSubmission
          ? true
          : severitySelected?.decryptSubmissions === undefined
          ? false
          : !severitySelected?.decryptSubmissions;

        if (isEncrypted !== description.isEncrypted) {
          setValue(`descriptions.${idx}.isEncrypted`, isEncrypted);
        }
      }
    }
  }, [controlledDescriptions, vault, setValue, isAuditSubmission]);

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

  return (
    <StyledSubmissionDescriptionsList>
      {controlledDescriptions.map((submissionDescription, index) => {
        return (
          <StyledSubmissionDescription key={submissionDescription.id} isEncrypted={!!submissionDescription.isEncrypted}>
            <p className="title mb-2">
              <span>
                {t("issue")} #{index + 1}
              </span>
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
            </p>
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
