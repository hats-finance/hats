import { GithubIssue, ISubmissionMessageObject, IVulnerabilitySeverity } from "@hats.finance/shared";
import { FormSupportFilesInput } from "components/FormControls";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import RemoveIcon from "@mui/icons-material/DeleteOutlined";
import FlagIcon from "@mui/icons-material/OutlinedFlagOutlined";
import { useInView } from 'react-intersection-observer';
import { useState, useEffect, useMemo, useContext } from 'react';
import { Loading, Alert, Button, FormInput, FormMDEditor, FormSelectInput, FormSelectInputOption, Pill, WithTooltip } from 'components';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { ISubmissionsDescriptionsData } from "../../types";
import { getCreateDescriptionSchema } from "./formSchema";
import { StyledSubmissionDescription, StyledSubmissionDescriptionsList as BaseStyledSubmissionDescriptionsList } from "./styles";
import { getAuditSubmissionTexts, getBountySubmissionTexts } from "./utils";
import styled from 'styled-components';
import { useSubmissionDebounce } from "../../hooks/useSubmissionDebounce";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useClaimedIssuesByVaultAndClaimedBy } from "pages/Honeypots/VaultDetailsPage/Sections/VaultSubmissionsSection/PublicSubmissionCard/hooks";
import { getVaultRepoName } from "pages/Honeypots/VaultDetailsPage/savedSubmissionsService";
import { HoneypotsRoutePaths } from "pages/Honeypots/router";
import { searchFileInHatsRepo } from "utils/github.utils";
import { slugify } from "utils/slug.utils";
import { encryptWithHatsKey, encryptWithKeys } from "../../encrypt";
import { SUBMISSION_INIT_DATA, SubmissionFormContext } from "../../store";
import { getCustomIsDirty, useEnhancedForm } from "hooks/form";
import download from "downloadjs";
import moment from "moment";
import { getGithubIssuesFromVault } from "pages/CommitteeTools/SubmissionsTool/submissionsService.api";

// Extend the base styled component
const StyledSubmissionDescriptionsList = styled(BaseStyledSubmissionDescriptionsList)`
  .load-more-trigger {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    margin-top: 1rem;
    opacity: 0.7;
    min-height: 60px;
  }
`;

export function SubmissionDescriptions() {
  const { t } = useTranslation();
  const { address } = useAccount();
  const navigate = useNavigate();
  const { data: hackerProfile } = useProfileByAddress(address);
  const { submissionData, setSubmissionData, vault, allFormDisabled } = useContext(SubmissionFormContext);
  
  // State hooks
  const [severitiesOptions, setSeveritiesOptions] = useState<FormSelectInputOption[] | undefined>();
  const [vaultGithubIssuesOpts, setVaultGithubIssuesOpts] = useState<FormSelectInputOption[] | undefined>();
  const [vaultGithubIssues, setVaultGithubIssues] = useState<GithubIssue[] | undefined>(undefined);
  const [isLoadingGH, setIsLoadingGH] = useState<boolean>(false);
  const [visibleSubmissions, setVisibleSubmissions] = useState<number>(5); // ITEMS_PER_PAGE = 5
  const { ref: loadMoreRef, inView } = useInView();

  const isAuditSubmission = vault?.description?.["project-metadata"].type === "audit";
  const isPrivateAudit = vault?.description?.["project-metadata"].isPrivateAudit;
  const bonusPointsEnabled = vault?.description?.["project-metadata"].bonusPointsEnabled;

  const { data: claimedIssues, isLoading: isLoadingClaimedIssues } = useClaimedIssuesByVaultAndClaimedBy(vault, address);

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

  const {
    debouncedUpdateDescription,
    debouncedUpdateTitle,
    debouncedHandleFixFiles,
    debouncedHandleTestFiles
  } = useSubmissionDebounce(setValue);

  // Memoized values
  const memoizedControlledDescriptions = useMemo(() => 
    fields.map((field, index) => ({
      ...field,
      ...watchDescriptions[index],
    })),
    [fields, watchDescriptions]
  );

  const visibleDescriptions = useMemo(() => 
    memoizedControlledDescriptions.slice(0, visibleSubmissions),
    [memoizedControlledDescriptions, visibleSubmissions]
  );

  // Effects
  useEffect(() => {
    if (submissionData?.submissionsDescriptions) {
      reset(submissionData.submissionsDescriptions);
    }
  }, [submissionData, reset]);

  useEffect(() => {
    if (!vault?.description) return;
    const severities = vault.description.severities.map((severity: IVulnerabilitySeverity) => ({
      label: severity.name.toLowerCase().replace("severity", "").trim(),
      value: severity.name.toLowerCase(),
    }));
    setSeveritiesOptions(severities);
  }, [vault, t]);

  useEffect(() => {
    if (!vault || !vault.description || !vault.description.severities) return;

    for (const [idx, description] of memoizedControlledDescriptions.entries()) {
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
  }, [memoizedControlledDescriptions, vault, setValue, isAuditSubmission]);

  useEffect(() => {
    if (inView && visibleSubmissions < memoizedControlledDescriptions.length) {
      setVisibleSubmissions(prev => Math.min(prev + 5, memoizedControlledDescriptions.length));
    }
  }, [inView, memoizedControlledDescriptions.length, visibleSubmissions]);

  useEffect(() => {
    setVisibleSubmissions(5);
  }, [fields.length]);

  // Add GitHub issues loading effect
  useEffect(() => {
    const loadGithubIssues = async () => {
      if (!vault || !claimedIssues || isLoadingGH) return;
      
      try {
        setIsLoadingGH(true);
        const ghIssues = await getGithubIssuesFromVault(vault);
        const filteredIssues = ghIssues.filter((ghIssue) =>
          claimedIssues?.some(
            (ci) => +ci.issueNumber === +ghIssue.number && !moment(ci.expiresAt).isBefore(moment())
          ) && (ghIssue.bonusPointsLabels.needsFix || ghIssue.bonusPointsLabels.needsTest)
        );

        const issueOptions = filteredIssues.map((ghIssue) => ({
          label: `[#${ghIssue.number}] ${ghIssue.title}`,
          value: `${ghIssue.number}`,
        }));

        setVaultGithubIssues(ghIssues);
        setVaultGithubIssuesOpts(issueOptions);
      } catch (error) {
        console.error('Failed to load GitHub issues:', error);
      } finally {
        setIsLoadingGH(false);
      }
    };

    loadGithubIssues();
  }, [vault, claimedIssues, isLoadingGH]);

  // Reset GitHub issues when address changes
  useEffect(() => {
    setVaultGithubIssuesOpts(undefined);
    setVaultGithubIssues(undefined);
  }, [address]);

  // Early return with error message
  if (!vault) {
    return <Alert type="error">{t("Submissions.firstYouNeedToSelectAProject")}</Alert>;
  }

  const getSubmissionsRoute = () => {
    const mainRoute = `/${isAuditSubmission ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`;
    const vaultSlug = slugify(vault.description?.["project-metadata"].name ?? "");

    return `${mainRoute}/${vaultSlug}-${vault.id}/submissions`;
  };

  const getNewIssueForm = (submissionDescription: (typeof memoizedControlledDescriptions)[number], index: number) => {
    return (
      <>
        <p className="mb-4">{t("Submissions.provideExplanation")}</p>
        <div className="row">
          <FormInput
            {...register(`descriptions.${index}.title`)}
            disabled={allFormDisabled}
            label={t("Submissions.submissionTitle")}
            placeholder={t("Submissions.submissionTitlePlaceholder")}
            colorable
            onChange={(e) => debouncedUpdateTitle(index, e.target.value)}
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
              value={field.value}
              onChange={(value) => debouncedUpdateDescription(index, value)}
            />
          )}
        />

        <p className="mb-4">Does this issue needs a fix?</p>
        <div className={`options mt-3 mb-5 ${errors.descriptions?.[index]?.isTestApplicable ? "error-text" : ""}`}>
          <div
            className="option"
            onClick={() => setValue(`descriptions.${index}.isTestApplicable`, true, { shouldValidate: true })}
          >
            <div className={`check-circle ${submissionDescription.isTestApplicable === true ? "selected" : ""}`} />
            <div className="info">
              <p>{t("Submissions.pocIsApplicable")}</p>
            </div>
          </div>

          <div
            className="option"
            onClick={() => setValue(`descriptions.${index}.isTestApplicable`, false, { shouldValidate: true })}
          >
            <div className={`check-circle ${submissionDescription.isTestApplicable === false ? "selected" : ""}`} />
            <div className="info">
              <p>{t("Submissions.pocIsNotApplicable")}</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const getComplementIssueForm = (submissionDescription: (typeof memoizedControlledDescriptions)[number], index: number) => {
    const { complementGhIssue, needsFix, needsTest } = submissionDescription;

    return (
      <>
        <p className="mb-4">{t("Submissions.selectIssueToComplement")}</p>
        {(!vaultGithubIssuesOpts || vaultGithubIssuesOpts?.length === 0) && (
          <>
            <Alert className="mb-4" type="warning">
              {t("Submissions.firstYouNeedToClaimSomeIssues")}
            </Alert>

            <Button className="mt-2" onClick={() => navigate(getSubmissionsRoute())}>
              <FlagIcon className="mr-1" /> {t("Submissions.claimFixAndTest")}
            </Button>
          </>
        )}

        {vaultGithubIssuesOpts && vaultGithubIssuesOpts?.length > 0 && (
          <>
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
                    if (ghIssue) {
                      setValue(`descriptions.${index}.complementGhIssue`, ghIssue);
                      setValue(`descriptions.${index}.needsFix`, ghIssue.bonusPointsLabels.needsFix);
                      setValue(`descriptions.${index}.needsTest`, ghIssue.bonusPointsLabels.needsTest);
                    }
                  }}
                />
              )}
            />

            {/* labels */}
            <div className="gh-labels">
              <div className="labels">
                {complementGhIssue?.bonusPointsLabels.needsFix && <Pill dotColor="yellow" textColor="white" text="Needs Fix" />}
                {complementGhIssue?.bonusPointsLabels.needsTest && <Pill dotColor="yellow" textColor="white" text="Needs Test" />}
              </div>
            </div>

            {/* Fix PR section */}
            {needsFix && (
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
                  onChange={async (a) => {
                    if (!a?.length) return;
                    for (const file of a) {
                      const fixFiles = getValues(`descriptions.${index}.complementFixFiles`);
                      if (fixFiles.some((f) => f.file.ipfsHash === file.ipfsHash)) continue;
                      const newFile = { file, path: "", pathOpts: [] };

                      const repoName = await getVaultRepoName(vault?.id);
                      if (!repoName) {
                        setValue(`descriptions.${index}.complementFixFiles`, [...fixFiles, newFile]);
                        return;
                      }

                      const pathOptions = await searchFileInHatsRepo(repoName, file.name);
                      if (pathOptions.length === 0) {
                        setValue(`descriptions.${index}.complementFixFiles`, [...fixFiles, newFile]);
                      } else if (pathOptions.length === 1) {
                        setValue(`descriptions.${index}.complementFixFiles`, [
                          ...fixFiles,
                          { ...newFile, path: pathOptions[0], pathOpts: [] },
                        ]);
                      } else {
                        setValue(`descriptions.${index}.complementFixFiles`, [
                          ...fixFiles,
                          { ...newFile, path: "", pathOpts: pathOptions },
                        ]);
                      }
                    }
                  }}
                />

                <div className="files-attached-container">
                  <div className="files">
                    {(submissionDescription.complementFixFiles ?? []).map((item, idx) => (
                      <li key={idx}>
                        <div className="file-container">
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
                            <p>{item.file?.name}</p>
                          </div>

                          <div className="file-path">
                            <p>{t("Submissions.filePath")}:</p>
                            <div className="file-path-input">
                              <FormInput
                                {...register(`descriptions.${index}.complementFixFiles.${idx}.path`)}
                                disabled={allFormDisabled}
                                label={`${t("Submissions.filePath")}`}
                                placeholder={t("Submissions.filePathPlaceholder")}
                                colorable
                              />
                            </div>
                          </div>
                        </div>

                        <div className="file-opts">
                          {item.pathOpts?.map((opt) => (
                            <div key={opt} onClick={() => setValue(`descriptions.${index}.complementFixFiles.${idx}.path`, opt)}>
                              <Pill isSeverity textColor="white" text={opt} capitalize={false} />
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="mt-5" />

            {/* Test PR section */}
            {!submissionDescription.testNotApplicable && needsTest && (
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
                  onChange={async (a) => {
                    if (!a?.length) return;
                    for (const file of a) {
                      const testFiles = getValues(`descriptions.${index}.complementTestFiles`);
                      if (testFiles.some((f) => f.file.ipfsHash === file.ipfsHash)) continue;
                      const newFile = { file, path: "", pathOpts: [] };

                      const repoName = await getVaultRepoName(vault?.id);
                      if (!repoName) {
                        setValue(`descriptions.${index}.complementTestFiles`, [...testFiles, newFile]);
                        return;
                      }

                      const pathOptions = await searchFileInHatsRepo(repoName, file.name);
                      if (pathOptions.length === 0) {
                        setValue(`descriptions.${index}.complementTestFiles`, [...testFiles, newFile]);
                      } else if (pathOptions.length === 1) {
                        setValue(`descriptions.${index}.complementTestFiles`, [
                          ...testFiles,
                          { ...newFile, path: pathOptions[0], pathOpts: [] },
                        ]);
                      } else {
                        setValue(`descriptions.${index}.complementTestFiles`, [
                          ...testFiles,
                          { ...newFile, path: "", pathOpts: pathOptions },
                        ]);
                      }
                    }
                  }}
                />

                <div className="files-attached-container">
                  <div className="files">
                    {(submissionDescription.complementTestFiles ?? []).map((item, idx) => (
                      <li key={idx}>
                        <div className="file-container">
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
                            <p>{item.file?.name}</p>
                          </div>

                          <div className="file-path">
                            <p>{t("Submissions.filePath")}:</p>
                            <div className="file-path-input">
                              <FormInput
                                {...register(`descriptions.${index}.complementTestFiles.${idx}.path`)}
                                disabled={allFormDisabled}
                                label={`${t("Submissions.filePath")}`}
                                placeholder={t("Submissions.filePathPlaceholder")}
                                colorable
                              />
                            </div>
                          </div>
                        </div>

                        <div className="file-opts">
                          {item.pathOpts?.map((opt) => (
                            <div key={opt} onClick={() => setValue(`descriptions.${index}.complementTestFiles.${idx}.path`, opt)}>
                              <Pill isSeverity textColor="white" text={opt} capitalize={false} />
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </div>
                </div>
              </>
            )}
            {needsTest && needsFix && (
              <div>
                <FormInput
                  {...register(`descriptions.${index}.testNotApplicable`)}
                  noMargin
                  type="checkbox"
                  label={t("Submissions.testNotApplicable")}
                />
              </div>
            )}
          </>
        )}
      </>
    );
  };

  const handleSaveAndDownloadDescription = async (formData: ISubmissionsDescriptionsData) => {
    if (!vault) return;
    if (!submissionData) return alert("Please fill previous steps first.");

    try {
      setIsLoadingGH(true); // Show loading while processing

      let keyOrKeys: string | string[];

      // Get public keys from vault description
      if (vault.version === "v1") {
        keyOrKeys = vault.description?.["communication-channel"]?.["pgp-pk"] ?? [];
      } else {
        keyOrKeys = vault.description?.committee.members.flatMap(
          (member) => member["pgp-keys"].map((key) => key.publicKey)
        ) ?? [];
      }

      keyOrKeys = typeof keyOrKeys === "string" ? keyOrKeys : keyOrKeys.filter((key) => !!key);
      if (keyOrKeys.length === 0) {
        throw new Error("This project has no keys to encrypt the description. Please contact HATS team.");
      }

      const getSubmissionTextsFunction = isAuditSubmission ? getAuditSubmissionTexts : getBountySubmissionTexts;
      const submissionTexts = getSubmissionTextsFunction(submissionData, formData.descriptions, hackerProfile);

      const toEncrypt = submissionTexts.toEncrypt;
      const decrypted = submissionTexts.decrypted;
      const submissionMessage = submissionTexts.submissionMessage;

      const encryptionResult = await encryptWithKeys(keyOrKeys, toEncrypt);
      if (!encryptionResult) {
        throw new Error("This vault doesn't have any valid key, please contact hats team");
      }

      const { encryptedData, sessionKey } = JSON.parse(encryptionResult);

      let submissionInfo: ISubmissionMessageObject = {
        ref: submissionData.ref,
        isEncryptedByHats: isPrivateAudit,
        decrypted: isPrivateAudit ? await encryptWithHatsKey(decrypted ?? "--Nothing decrypted--") : decrypted,
        encrypted: encryptedData,
      };

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
    } catch (error) {
      console.error('Submission processing failed:', error);
      alert(error instanceof Error ? error.message : "There was a problem processing your submission. Please try again.");
    } finally {
      setIsLoadingGH(false); // Hide loading when done
    }
  };

  return (
    <StyledSubmissionDescriptionsList>
      {visibleDescriptions.map((submissionDescription, index) => (
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

          {bonusPointsEnabled && (
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
          )}

          {submissionDescription.type === "new"
            ? getNewIssueForm(submissionDescription, index)
            : getComplementIssueForm(submissionDescription, index)}

          {visibleDescriptions.length > 1 && !allFormDisabled && (
            <div className="buttons mt-3">
              <Button onClick={() => removeSubmissionDescription(index)} styleType="outlined" filledColor="secondary">
                <RemoveIcon className="mr-3" />
                {t("Submissions.removeIssue")}
              </Button>
            </div>
          )}
        </StyledSubmissionDescription>
      ))}

      {visibleSubmissions < memoizedControlledDescriptions.length && (
        <div ref={loadMoreRef} className="load-more-trigger">
          <Loading fixed={false} extraText="" />
        </div>
      )}

      <div className="buttons mt-3">
        {!allFormDisabled && (
          <Button
            onClick={() => {
              appendSubmissionDescription(SUBMISSION_INIT_DATA.submissionsDescriptions.descriptions[0]);
              setVisibleSubmissions(prev => prev + 1);
            }}
            styleType="invisible"
          >
            <AddIcon className="mr-3" />
            {t("Submissions.addAnotherVulnerability")}
          </Button>
        )}
        <Button onClick={handleSubmit(handleSaveAndDownloadDescription)}>{t("Submissions.saveAndDownload")}</Button>
      </div>

      {(isLoadingClaimedIssues || isLoadingGH) && <Loading fixed extraText={`${t("loading")}...`} />}
    </StyledSubmissionDescriptionsList>
  );
}

