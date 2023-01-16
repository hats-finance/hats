import { useTranslation } from "react-i18next";
import { Controller, useFieldArray, UseFieldArrayRemove } from "react-hook-form";
import { FormInput, FormIconInput, FormPgpPublicKeyInput, Button } from "components";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { ICommitteeMember } from "types";
import { createNewCommitteeMember } from "../../utils";
import { IEditedVaultDescription } from "../../types";
import { StyledCommitteeMemberForm } from "./styles";
import { getPath } from "utils/objects.utils";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";

type CommitteeMemberFormProps = {
  index: number;
  membersCount: number;
  append: (data: ICommitteeMember) => void;
  remove: UseFieldArrayRemove;
};

const CommitteeMemberForm = ({ index, append, remove, membersCount }: CommitteeMemberFormProps) => {
  const { t } = useTranslation();

  const { register, control } = useEnhancedFormContext<IEditedVaultDescription>();
  const {
    fields: pgpPublicKeys,
    append: appendKey,
    remove: removeKey,
  } = useFieldArray({ control, name: `committee.members.${index}.pgp-keys` });

  return (
    <StyledCommitteeMemberForm>
      <div className="member-details">
        <div className="content">
          <FormInput
            {...register(`committee.members.${index}.name`)}
            label={t("VaultEditor.member-name")}
            colorable
            placeholder={t("VaultEditor.member-name-placeholder", { index: index + 1 })}
          />
          <FormInput
            {...register(`committee.members.${index}.address`)}
            label={t("VaultEditor.member-address")}
            pastable
            colorable
            placeholder={t("VaultEditor.member-address-placeholder", { index: index + 1 })}
          />

          <div className="inputs">
            <FormInput
              {...register(`committee.members.${index}.twitter-link`)}
              label={t("VaultEditor.member-twitter")}
              pastable
              colorable
              placeholder={t("VaultEditor.member-twitter-placeholder", { index: index + 1 })}
            />
            <FormIconInput
              {...register(`committee.members.${index}.image-ipfs-link`)}
              label={t("VaultEditor.member-image")}
              type="image"
              colorable
            />
          </div>

          {pgpPublicKeys.map((pgpKey, pgpKeyIndex) => (
            <Controller
              key={pgpKey.id}
              control={control}
              name={`committee.members.${index}.pgp-keys.${pgpKeyIndex}.publicKey`}
              render={({ field, formState }) => (
                <FormPgpPublicKeyInput
                  noMargin
                  isDirty={getPath(formState.dirtyFields, field.name)}
                  error={getPath(formState.errors, field.name)}
                  colorable
                  {...field}
                />
              )}
            />
          ))}

          <Button styleType="invisible" onClick={() => append(createNewCommitteeMember())}>
            <AddIcon className="mr-1" />
            <p>{t("addMember")}</p>
          </Button>
        </div>
      </div>

      <div className="controller-buttons">
        {membersCount > 1 && (
          <Button styleType="filled" onClick={() => remove(index)}>
            <DeleteIcon className="mr-1" />
            <p>{t("removeMember")}</p>
          </Button>
        )}
      </div>
    </StyledCommitteeMemberForm>
  );
};

export default CommitteeMemberForm;
