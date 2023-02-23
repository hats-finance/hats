import { useContext } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useEnhancedFormContext, getCustomIsDirty } from "hooks/useEnhancedFormContext";
import { Button, FormInput } from "components";
import { IEditedCommunicationEmail, IEditedVaultDescription } from "types";
import { getPath } from "utils/objects.utils";
import { isEmailAddress } from "utils/emails.utils";
import { VaultEditorFormContext } from "../../store";
import * as VaultService from "../../vaultService";
import { StyledVaultEmailsForm } from "./styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VerifyEmailIcon from "@mui/icons-material/ForwardToInboxOutlined";
import ReverifyEmailIcon from "@mui/icons-material/Replay";
import CheckIcon from "@mui/icons-material/CheckOutlined";
import { useTranslation } from "react-i18next";

type VaultEmailsFormProps = {
  onlyNotVerifiedEmails?: boolean;
};

export const VaultEmailsForm = ({ onlyNotVerifiedEmails }: VaultEmailsFormProps) => {
  const { t } = useTranslation();
  const { saveEditSessionData, editSessionId, isEditingExitingVault, allFormDisabled } = useContext(VaultEditorFormContext);

  const {
    control,
    formState: { errors },
  } = useEnhancedFormContext<IEditedVaultDescription>();

  const {
    fields: emails,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({ control, name: `project-metadata.emails` });

  const resendVerificationEmail = async (email: string) => {
    if (editSessionId) {
      const resOk = await VaultService.resendVerificationEmail(editSessionId, email);

      if (resOk) {
        alert(t("email-verification-sent"));
      } else {
        alert(t("email-verification-error"));
      }
    }
  };

  const getEmailActionButton = (emailData: IEditedCommunicationEmail, value: string, emailIndex: number) => {
    const isValidEmail = isEmailAddress(value);

    const removeButton = (withText = true, saveForm = false) => (
      <Button
        styleType="invisible"
        noPadding={!withText}
        onClick={() => {
          removeEmail(emailIndex);
          if (saveForm) saveEditSessionData();
        }}
      >
        <DeleteIcon className="mr-2" />
        {withText && <span>{t("remove")}</span>}
      </Button>
    );

    const verifyButton = (
      <Button styleType="invisible" onClick={() => saveEditSessionData()}>
        <VerifyEmailIcon className="mr-2" />
        <span>{t("verify")}</span>
      </Button>
    );

    const reverifyButton = (
      <Button styleType="invisible" onClick={() => resendVerificationEmail(value)}>
        <ReverifyEmailIcon className="mr-2" />
        <span>{t("reverify")}</span>
      </Button>
    );

    const verifyAndRemoveButton = (
      <div className="multiple-buttons">
        {verifyButton}
        {removeButton(false)}
      </div>
    );

    const reverifyAndRemoveButton = (
      <div className="multiple-buttons">
        {reverifyButton}
        {removeButton(false, true)}
      </div>
    );

    const moreThanOneEmail = emails.length > 1;

    if (emailData.status === "unverified") {
      if (isValidEmail && moreThanOneEmail) return verifyAndRemoveButton;
      if (isValidEmail && !moreThanOneEmail) return verifyButton;
      if (moreThanOneEmail) return removeButton();
      return <></>;
    } else if (emailData.status === "verified") {
      if (moreThanOneEmail) return removeButton(true, true);
    } else {
      if (moreThanOneEmail) return reverifyAndRemoveButton;
      return reverifyButton;
    }
  };

  return (
    <StyledVaultEmailsForm>
      {!isEditingExitingVault && (
        <div className="emails">
          {emails.map((email, emailIndex) => (
            <Controller
              key={email.id}
              control={control}
              name={`project-metadata.emails.${emailIndex}.address`}
              render={({ field, formState: { dirtyFields, defaultValues, errors } }) => {
                return onlyNotVerifiedEmails && email.status === "verified" ? (
                  <></>
                ) : (
                  <div className="emails__item">
                    <FormInput
                      prefixIcon={email.status === "verified" ? <CheckIcon /> : undefined}
                      isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                      error={getPath(errors, field.name)}
                      disabled={email.status === "verified" || email.status === "verifying" || allFormDisabled}
                      noMargin
                      colorable
                      placeholder={t("VaultEditor.vault-details.email-placeholder")}
                      label={t("VaultEditor.vault-details.email")}
                      {...field}
                      onChange={email.status === "verified" || email.status === "verifying" ? () => {} : field.onChange}
                    />
                    {!allFormDisabled && <>{getEmailActionButton(email, field.value, emailIndex)}</>}
                  </div>
                );
              }}
            />
          ))}

          {getPath(errors, "project-metadata.emails") && (
            <p className="field-error">{getPath(errors, "project-metadata.emails")?.message}</p>
          )}

          {!allFormDisabled && (
            <Button className="mt-2" styleType="invisible" onClick={() => appendEmail({ address: "", status: "unverified" })}>
              <AddIcon className="mr-2" />
              <span>{t("newEmail")}</span>
            </Button>
          )}
        </div>
      )}
    </StyledVaultEmailsForm>
  );
};
