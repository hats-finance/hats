import { useEffect } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { getPath } from "utils/objects.utils";
import { isEmailAddress } from "utils/emails.utils";
import { FormInput, FormIconInput, FormDateInput, FormSelectInput, Button } from "components";
import { IEditedCommunicationEmail, IEditedVaultDescription } from "types";
import { StyledVaultDetails } from "./styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VerifyEmailIcon from "@mui/icons-material/ForwardToInboxOutlined";
import ReverifyEmailIcon from "@mui/icons-material/Replay";
import CheckIcon from "@mui/icons-material/CheckOutlined";

export function VaultDetailsForm() {
  const { t } = useTranslation();

  const { register, control, resetField, setValue } = useEnhancedFormContext<IEditedVaultDescription>();
  const {
    fields: emails,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({ control, name: `project-metadata.emails` });

  const showDateInputs = useWatch({ control, name: "includesStartAndEndTime" });

  const vaultTypes = [
    { label: t("bugBountyProgram"), value: "normal" },
    { label: t("auditCompetition"), value: "audit" },
    { label: t("grant"), value: "grants" },
  ];

  useEffect(() => {
    if (showDateInputs) {
      resetField("project-metadata.starttime");
      resetField("project-metadata.endtime");
    } else {
      setValue("project-metadata.starttime", undefined);
      setValue("project-metadata.endtime", undefined);
    }
  }, [showDateInputs, setValue, resetField]);

  const getEmailActionButton = (emailData: IEditedCommunicationEmail, value: string, emailIndex: number) => {
    const isValidEmail = isEmailAddress(value);

    const removeButton = (
      <Button styleType="invisible" onClick={() => removeEmail(emailIndex)}>
        <DeleteIcon className="mr-2" />
        <span>{t("remove")}</span>
      </Button>
    );

    const verifyButton = (
      <Button styleType="invisible" onClick={() => console.log("test verify")}>
        <VerifyEmailIcon className="mr-2" />
        <span>{t("verify")}</span>
      </Button>
    );

    const reverifyButton = (
      <Button styleType="invisible" onClick={() => console.log("test reverify")}>
        <ReverifyEmailIcon className="mr-2" />
        <span>{t("reverify")}</span>
      </Button>
    );

    const verifyAndRemoveButton = (
      <div className="multiple-buttons">
        {verifyButton}
        <Button noPadding styleType="invisible" onClick={() => removeEmail(emailIndex)}>
          <DeleteIcon className="mr-2" />
        </Button>
      </div>
    );

    const reverifyAndRemoveButton = (
      <div className="multiple-buttons">
        {reverifyButton}
        <Button noPadding styleType="invisible" onClick={() => removeEmail(emailIndex)}>
          <DeleteIcon className="mr-2" />
        </Button>
      </div>
    );

    const moreThanOneEmail = emails.length > 1;

    if (emailData.status === "unverified") {
      if (isValidEmail && moreThanOneEmail) return verifyAndRemoveButton;
      if (isValidEmail && !moreThanOneEmail) return verifyButton;
      if (moreThanOneEmail) return removeButton;
      return <></>;
    } else if (emailData.status === "verified") {
      if (moreThanOneEmail) return removeButton;
    } else {
      if (moreThanOneEmail) return reverifyAndRemoveButton;
      return reverifyButton;
    }
  };

  return (
    <StyledVaultDetails>
      <div className="sub-container">
        <div className="inputs">
          <FormInput
            {...register("project-metadata.name")}
            label={t("VaultEditor.vault-details.name")}
            colorable
            placeholder={t("VaultEditor.vault-details.name-placeholder")}
          />
          <Controller
            control={control}
            name={`project-metadata.type`}
            render={({ field, formState: { errors, dirtyFields, defaultValues } }) => (
              <FormSelectInput
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={getPath(errors, field.name)}
                label={t("VaultEditor.vault-details.type")}
                placeholder={t("VaultEditor.vault-details.type-placeholder")}
                colorable
                options={vaultTypes}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>

        <div className="emails">
          {emails.map((email, emailIndex) => (
            <Controller
              key={email.id}
              control={control}
              name={`project-metadata.emails.${emailIndex}.address`}
              render={({ field, formState: { dirtyFields, defaultValues, errors } }) => (
                <div className="emails__item">
                  <FormInput
                    prefixIcon={email.status === "verified" ? <CheckIcon /> : undefined}
                    isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                    error={getPath(errors, field.name)}
                    disabled={email.status === "verified" || email.status === "verifying"}
                    noMargin
                    colorable
                    placeholder={t("VaultEditor.vault-details.email-placeholder")}
                    label={t("VaultEditor.vault-details.email")}
                    {...field}
                    onChange={email.status === "verified" || email.status === "verifying" ? () => {} : field.onChange}
                  />
                  <>{getEmailActionButton(email, field.value, emailIndex)}</>
                </div>
              )}
            />
          ))}

          <Button styleType="invisible" onClick={() => appendEmail({ address: "", status: "unverified" })}>
            <AddIcon className="mr-2" />
            <span>{t("newEmail")}</span>
          </Button>
        </div>

        <div className="inputs col-sm">
          <FormInput
            {...register("project-metadata.website")}
            colorable
            placeholder={t("VaultEditor.vault-details.website-placeholder")}
            label={t("VaultEditor.vault-details.website")}
          />

          <div className="icons">
            <FormIconInput {...register("project-metadata.icon")} colorable label={t("VaultEditor.vault-details.icon")} />
            <FormIconInput
              {...register("project-metadata.tokenIcon")}
              colorable
              label={t("VaultEditor.vault-details.token-icon")}
            />
          </div>
        </div>
      </div>

      <br />

      <FormInput {...register("includesStartAndEndTime")} type="checkbox" label={t("VaultEditor.addStartAndEndDate")} />

      {showDateInputs && (
        <div className="inputs">
          <Controller
            control={control}
            name={`project-metadata.starttime`}
            render={({ field, formState: { errors, defaultValues, dirtyFields } }) => (
              <FormDateInput
                withTime
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={getPath(errors, field.name)}
                label={t("VaultEditor.vault-details.starttime")}
                placeholder={t("VaultEditor.vault-details.starttime-placeholder")}
                colorable
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name={`project-metadata.endtime`}
            render={({ field, formState: { errors, defaultValues, dirtyFields } }) => (
              <FormDateInput
                withTime
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={getPath(errors, field.name)}
                label={t("VaultEditor.vault-details.endtime")}
                placeholder={t("VaultEditor.vault-details.endtime-placeholder")}
                colorable
                {...field}
              />
            )}
          />
        </div>
      )}
    </StyledVaultDetails>
  );
}
