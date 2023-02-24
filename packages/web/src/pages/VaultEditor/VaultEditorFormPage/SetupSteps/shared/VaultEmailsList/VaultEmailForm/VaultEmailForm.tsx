import { useContext } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, FormInput } from "components";
import { IEditedCommunicationEmail, IEditedVaultDescription } from "types";
import { isEmailAddress } from "utils/emails.utils";
import { VaultEditorFormContext } from "pages/VaultEditor/VaultEditorFormPage/store";
import { useEnhancedFormContext, getCustomIsDirty } from "hooks/useEnhancedFormContext";
import { getPath } from "utils/objects.utils";
import * as VaultService from "../../../../vaultService";
import { StyledVaultEmail } from "./styles";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VerifyEmailIcon from "@mui/icons-material/ForwardToInboxOutlined";
import ReverifyEmailIcon from "@mui/icons-material/Replay";
import CheckIcon from "@mui/icons-material/CheckOutlined";

type VaultEmailFormProps = {
  index: number;
  emailsCount: number;
  email: IEditedCommunicationEmail;
  remove: (index: number) => void;
};

export const VaultEmailForm = ({ index, email, emailsCount, remove }: VaultEmailFormProps) => {
  const { t } = useTranslation();

  const { control } = useEnhancedFormContext<IEditedVaultDescription>();
  const { editSessionId, saveEditSessionData, allFormDisabled } = useContext(VaultEditorFormContext);

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
          remove(emailIndex);
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

    const moreThanOneEmail = emailsCount > 1;

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
    <Controller
      control={control}
      name={`project-metadata.emails.${index}.address`}
      render={({ field, formState: { dirtyFields, defaultValues, errors } }) => (
        <StyledVaultEmail className="emails__item">
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
          {!allFormDisabled && <>{getEmailActionButton(email, field.value, index)}</>}
        </StyledVaultEmail>
      )}
    />
  );
};
