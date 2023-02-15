import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFieldArray, UseFieldArrayRemove, useWatch } from "react-hook-form";
import { FormInput, FormIconInput, FormPgpPublicKeyInput, Button } from "components";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import useConfirm from "hooks/useConfirm";
import { ICommitteeMember } from "types";
import { IEditedVaultDescription } from "types";
import { StyledCommitteeMemberForm } from "./styles";
import { getPath } from "utils/objects.utils";
import { VaultEditorFormContext } from "../../../store";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";

type CommitteeMemberFormProps = {
  index: number;
  membersCount: number;
  isLastMultisigMember: boolean;
  append: (data: ICommitteeMember) => void;
  remove: UseFieldArrayRemove;
};

const CommitteeMemberForm = ({ index, append, remove, membersCount, isLastMultisigMember }: CommitteeMemberFormProps) => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const { register, control } = useEnhancedFormContext<IEditedVaultDescription>();
  const {
    fields: pgpPublicKeys,
    append: appendKey,
    remove: removeKey,
  } = useFieldArray({ control, name: `committee.members.${index}.pgp-keys` });

  const getAlreadyAddedPgpKeys = (toFilter: string) => {
    return pgpPublicKeys.map((key) => key.publicKey).filter((key) => key !== toFilter);
  };

  const linkedMultisigAddress = useWatch({ control, name: `committee.members.${index}.linkedMultisigAddress` });

  const handleRemoveMember = async () => {
    const wantsToDelete = await confirm({
      confirmText: t("remove"),
      description: t("areYouSureYouWantToRemoveThisMember"),
    });

    if (wantsToDelete) remove(index);
  };

  return (
    <>
      <StyledCommitteeMemberForm>
        {linkedMultisigAddress && (
          <div className="linkedMultisig">
            {t("memberOfMultisig")}: {linkedMultisigAddress}
          </div>
        )}
        {!linkedMultisigAddress && <div className="linkedMultisig outside">{t("notMemberOfMultisig")}</div>}
        <div className="member-details">
          <div className="content">
            <FormInput
              {...register(`committee.members.${index}.name`)}
              disabled={allFormDisabled}
              label={t("VaultEditor.member-name")}
              colorable
              placeholder={t("VaultEditor.member-name-placeholder", { index: index + 1 })}
            />
            <FormInput
              {...register(`committee.members.${index}.address`)}
              disabled={allFormDisabled}
              label={t("VaultEditor.member-address")}
              pastable
              colorable
              placeholder={t("VaultEditor.member-address-placeholder", { index: index + 1 })}
            />

            <div className="inputs">
              <FormInput
                {...register(`committee.members.${index}.twitter-link`)}
                disabled={allFormDisabled}
                label={t("VaultEditor.member-twitter")}
                pastable
                colorable
                placeholder={t("VaultEditor.member-twitter-placeholder", { index: index + 1 })}
              />
              <FormIconInput
                {...register(`committee.members.${index}.image-ipfs-link`)}
                disabled={allFormDisabled}
                label={t("VaultEditor.member-image")}
                type="image"
                colorable
              />
            </div>

            <div className="pgp-keys">
              {pgpPublicKeys.map((pgpKey, pgpKeyIndex) => (
                <Controller
                  key={pgpKey.id}
                  control={control}
                  name={`committee.members.${index}.pgp-keys.${pgpKeyIndex}.publicKey`}
                  render={({ field, formState: { errors, dirtyFields, defaultValues } }) => (
                    <div className="pgp-keys__item">
                      <FormPgpPublicKeyInput
                        noMargin
                        disabled={allFormDisabled}
                        isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                        error={getPath(errors, field.name)}
                        notAllowedKeys={getAlreadyAddedPgpKeys(field.value)}
                        colorable
                        {...field}
                      />
                      {!allFormDisabled && pgpPublicKeys.length > 1 && (
                        <Button styleType="invisible" onClick={() => removeKey(pgpKeyIndex)}>
                          <DeleteIcon className="mr-2" />
                          <span>{t("remove")}</span>
                        </Button>
                      )}
                    </div>
                  )}
                />
              ))}

              {!allFormDisabled && (
                <Button styleType="invisible" onClick={() => appendKey({ publicKey: "" })}>
                  <AddIcon className="mr-1" />
                  <span>{t("addPgpKey")}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        {membersCount > 1 && (
          <div className="controller-buttons">
            <Button styleType="filled" onClick={handleRemoveMember}>
              <DeleteIcon className="mr-1" />
              <span>{t("removeMember")}</span>
            </Button>
          </div>
        )}
      </StyledCommitteeMemberForm>

      {isLastMultisigMember && (
        <div className="pt-3">
          <p className="section-title">{t("committeeMembersOutsideMultisig")}</p>
          <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("committeeMembersOutsideMultisigExplanation") }} />
        </div>
      )}
    </>
  );
};

export default CommitteeMemberForm;
