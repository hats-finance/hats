import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFieldArray, UseFieldArrayRemove, useWatch } from "react-hook-form";
import { getSafeDashboardLink } from "@hats-finance/shared";
import { FormInput, FormIconInput, FormPgpPublicKeyInput, Button, WithTooltip } from "components";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import useConfirm from "hooks/useConfirm";
import { IEditedVaultDescription } from "types";
import { StyledCommitteeMemberForm } from "./styles";
import { getPath } from "utils/objects.utils";
import { VaultEditorFormContext } from "../../../store";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import GroupIcon from "@mui/icons-material/Groups";
import { shortenIfAddress } from "utils/addresses.utils";

type CommitteeMemberFormProps = {
  index: number;
  membersCount: number;
  isLastMultisigMember: boolean;
  remove: UseFieldArrayRemove;
};

const CommitteeMemberForm = ({ index, remove, membersCount, isLastMultisigMember }: CommitteeMemberFormProps) => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const { register, control, trigger } = useEnhancedFormContext<IEditedVaultDescription>();
  const {
    fields: pgpPublicKeys,
    append: appendKey,
    remove: removeKey,
  } = useFieldArray({ control, name: `committee.members.${index}.pgp-keys` });

  const getAlreadyAddedPgpKeys = (toFilter: string) => {
    return pgpPublicKeys.map((key) => key.publicKey).filter((key) => key !== toFilter);
  };

  const linkedMultisigAddress = useWatch({ control, name: `committee.members.${index}.linkedMultisigAddress` });
  const chainId = useWatch({ control, name: `committee.chainId` });

  const handleRemoveMember = async () => {
    const wantsToDelete = await confirm({
      confirmText: t("remove"),
      description: t("areYouSureYouWantToRemoveThisMember"),
    });

    if (wantsToDelete) remove(index);
  };

  const handleRemovePgpKey = async (keyIndex: number) => {
    const wantsToDelete = await confirm({
      confirmText: t("remove"),
      description: t("areYouSureYouWantToRemoveThisPgpKey"),
    });

    if (wantsToDelete) removeKey(keyIndex);
  };

  const handleGoToSafeAddress = () => {
    if (!linkedMultisigAddress || !chainId) return;
    window.open(getSafeDashboardLink(linkedMultisigAddress, +chainId));
  };

  return (
    <>
      <StyledCommitteeMemberForm>
        <div className="member-details">
          <div className="content">
            <div className="title">
              <p className="section-title no-underline no-bottom">{`${t("committeeMember")} ${index + 1}`}</p>
              <div className="multisig-info">
                {linkedMultisigAddress ? (
                  <WithTooltip text={`${t("multisig")}: ${linkedMultisigAddress}`}>
                    <span className="multisig-address" onClick={handleGoToSafeAddress}>
                      <GroupIcon />
                      {shortenIfAddress(linkedMultisigAddress)}
                    </span>
                  </WithTooltip>
                ) : (
                  <span className="multisig-outside">
                    <GroupIcon />
                    {t("notMemberOfMultisig")}
                  </span>
                )}
              </div>
            </div>

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
                        onChange={(value) => {
                          field.onChange(value);
                          trigger("committee.members");
                        }}
                      />
                      {!allFormDisabled && pgpPublicKeys.length > 1 && (
                        <Button styleType="invisible" onClick={() => handleRemovePgpKey(pgpKeyIndex)}>
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
