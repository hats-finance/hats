import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, FormInput, FormRadioInput } from "components";
import { useEnhancedForm } from "hooks/form";
import { useContext, useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { SubmissionFormContext } from "../../store";
import { ISubmissionContactData } from "../../types";
import { getCreateContactInfoSchema } from "./formSchema";
import { StyledContactInfo } from "./styles";

export function SubmissionContactInfo() {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { submissionData, setSubmissionData, vault, allFormDisabled } = useContext(SubmissionFormContext);

  const isAuditCompetition = vault?.description?.["project-metadata"].type === "audit";

  const { register, getValues, setValue, reset, handleSubmit, control, trigger } = useEnhancedForm<ISubmissionContactData>({
    resolver: yupResolver(getCreateContactInfoSchema(t)),
    mode: "onChange",
    defaultValues: { communicationChannelType: "discord" },
  });

  const communicationChannelType = useWatch({ control, name: "communicationChannelType" });
  useEffect(() => {
    const { communicationChannel } = getValues();
    if (communicationChannel) trigger("communicationChannel");
  }, [communicationChannelType, trigger, getValues]);

  // Reset form with saved data
  useEffect(() => {
    if (submissionData?.contact) reset(submissionData.contact);
  }, [submissionData, reset]);

  // Change beneficiary to current account (only if not set yet)
  useEffect(() => {
    const { beneficiary: currentBeneficiary } = getValues();
    if (!currentBeneficiary && account) setValue("beneficiary", account);
  }, [account, setValue, getValues]);

  const handleAddContactData = (contactData: ISubmissionContactData) => {
    setSubmissionData((prev) => {
      if (prev)
        return {
          ...prev,
          contact: { ...contactData, verified: true },
          submissionsDescriptions: { ...prev.submissionsDescriptions, verified: false },
          submissionResult: undefined,
        };
    });
  };

  const communicationChannelLabel = useMemo(() => {
    switch (communicationChannelType) {
      case "discord":
        return t("platformUsername", { platform: t("discord") });
      case "telegram":
        return t("platformUsername", { platform: t("telegram") });
      case "email":
        return t("emailAddress");
    }
  }, [communicationChannelType, t]);

  return (
    <StyledContactInfo>
      <p className="mb-2">{t("Submissions.addBeneficiaryAddress")}</p>
      <p className="mb-4">{t("Submissions.beneficiaryAddressNote")}</p>

      <FormInput
        {...register("beneficiary")}
        disabled={allFormDisabled}
        label={`${t("beneficiaryWalletAddress")}`}
        placeholder={t("beneficiaryWalletAddressPlaceholder")}
        colorable
      />

      <FormRadioInput
        {...register("communicationChannelType")}
        disabled={allFormDisabled}
        label={t("Submissions.addPreferredCommunicationChannel")}
        radioOptions={[
          { label: t("discord"), value: "discord" },
          { label: t("emailAddress"), value: "email" },
          { label: t("telegram"), value: "telegram" },
        ]}
      />

      <Alert type="warning" className="mb-4">
        {t("Submissions.contactDataIsEncrypted")}
      </Alert>

      <FormInput
        {...register("communicationChannel")}
        disabled={allFormDisabled}
        label={communicationChannelLabel}
        placeholder={t("enterCommunicationChannel")}
        colorable
      />

      {isAuditCompetition && (
        <>
          <p className="mb-2">{t("Submissions.addTwitterAccount")}</p>
          <FormInput
            {...register("twitterUsername")}
            disabled={allFormDisabled}
            label={`${t("twitterUsername")}`}
            placeholder={t("twitterUsernamePlaceholder")}
            colorable
          />
        </>
      )}

      {isAuditCompetition && (
        <>
          <p className="mb-2">{t("Submissions.addGithubAccountConnectIssue")}</p>
          <FormInput
            {...register("githubUsername")}
            disabled={allFormDisabled}
            label={`${t("githubUsername")}`}
            placeholder={t("githubUsernamePlaceholder")}
            colorable
          />
        </>
      )}

      <div className="buttons">
        <Button onClick={handleSubmit(handleAddContactData)}>{t("Submissions.saveContactInformation")}</Button>
      </div>
    </StyledContactInfo>
  );
}
