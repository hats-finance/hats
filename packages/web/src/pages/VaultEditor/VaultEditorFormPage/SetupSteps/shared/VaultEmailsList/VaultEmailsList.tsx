import AddIcon from "@mui/icons-material/Add";
import { Button } from "components";
import { useEnhancedFormContext } from "hooks/form/useEnhancedFormContext";
import { useContext } from "react";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IEditedVaultDescription } from "types";
import { getPath } from "utils/objects.utils";
import { VaultEditorFormContext } from "../../../store";
import { VaultEmailForm } from "./VaultEmailForm/VaultEmailForm";
import { StyledVaultEmailsForm } from "./styles";

type VaultEmailsFormProps = {
  onlyNotVerifiedEmails?: boolean;
};

export const VaultEmailsForm = ({ onlyNotVerifiedEmails }: VaultEmailsFormProps) => {
  const { t } = useTranslation();
  const { isEditingExistingVault, allFormDisabled } = useContext(VaultEditorFormContext);

  const {
    control,
    formState: { errors },
  } = useEnhancedFormContext<IEditedVaultDescription>();

  const {
    fields: emails,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({ control, name: `project-metadata.emails` });

  return (
    <StyledVaultEmailsForm>
      {!isEditingExistingVault && (
        <div className="emails">
          {emails.map((email, emailIndex) => {
            if (onlyNotVerifiedEmails && email.status === "verified") return <></>;
            return (
              <VaultEmailForm key={email.id} index={emailIndex} email={email} emailsCount={emails.length} remove={removeEmail} />
            );
          })}

          {getPath(errors, "project-metadata.emails") && (
            <p className="field-error">{getPath(errors, "project-metadata.emails")?.message}</p>
          )}

          {!allFormDisabled && (
            <Button className="mt-4" styleType="invisible" onClick={() => appendEmail({ address: "", status: "unverified" })}>
              <AddIcon className="mr-2" />
              <span>{t("newEmail")}</span>
            </Button>
          )}
        </div>
      )}
    </StyledVaultEmailsForm>
  );
};
